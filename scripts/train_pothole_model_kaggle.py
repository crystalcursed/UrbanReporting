import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import os
import cv2
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import json
from pathlib import Path

class KagglePotholeDetector:
    def __init__(self, img_height=224, img_width=224):
        self.img_height = img_height
        self.img_width = img_width
        self.model = None
        self.class_names = ['no_pothole', 'pothole']
        
    def load_classification_data(self, dataset_path):
        """Load the processed classification dataset"""
        dataset_path = Path(dataset_path)
        
        images = []
        labels = []
        
        for class_idx, class_name in enumerate(self.class_names):
            class_path = dataset_path / class_name
            if not class_path.exists():
                print(f"Warning: {class_path} does not exist")
                continue
                
            print(f"Loading {class_name} images...")
            class_images = list(class_path.glob("*.jpg")) + \
                          list(class_path.glob("*.png")) + \
                          list(class_path.glob("*.jpeg"))
            
            for img_path in class_images:
                try:
                    # Load and preprocess image
                    img = cv2.imread(str(img_path))
                    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                    img = cv2.resize(img, (self.img_width, self.img_height))
                    img = img.astype('float32') / 255.0
                    
                    images.append(img)
                    labels.append(class_idx)
                except Exception as e:
                    print(f"Error processing {img_path}: {e}")
        
        return np.array(images), np.array(labels)
    
    def create_data_generators(self, X_train, y_train, X_val, y_val, batch_size=32):
        """Create data generators with augmentation"""
        # Data augmentation for training
        train_datagen = keras.preprocessing.image.ImageDataGenerator(
            rotation_range=15,
            width_shift_range=0.1,
            height_shift_range=0.1,
            shear_range=0.1,
            zoom_range=0.1,
            horizontal_flip=True,
            brightness_range=[0.8, 1.2],
            fill_mode='nearest'
        )
        
        # No augmentation for validation
        val_datagen = keras.preprocessing.image.ImageDataGenerator()
        
        train_generator = train_datagen.flow(
            X_train, y_train,
            batch_size=batch_size,
            shuffle=True
        )
        
        val_generator = val_datagen.flow(
            X_val, y_val,
            batch_size=batch_size,
            shuffle=False
        )
        
        return train_generator, val_generator
    
    def create_stable_model(self):
        """Create a stable CNN model without complex metrics"""
        # Use a simpler but effective architecture
        base_model = keras.applications.EfficientNetB0(
            weights='imagenet',
            include_top=False,
            input_shape=(self.img_height, self.img_width, 3)
        )
        
        # Freeze base model initially
        base_model.trainable = False
        
        model = keras.Sequential([
            base_model,
            layers.GlobalAveragePooling2D(),
            layers.Dropout(0.3),
            layers.Dense(128, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.2),
            layers.Dense(64, activation='relu'),
            layers.Dropout(0.1),
            layers.Dense(len(self.class_names), activation='softmax')
        ])
        
        # Use simpler metrics to avoid shape conflicts
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']  # Only use accuracy to avoid shape issues
        )
        
        self.model = model
        self.base_model = base_model
        return model
    
    def train_stable(self, X_train, y_train, X_val, y_val, 
                    initial_epochs=15, fine_tune_epochs=20, batch_size=32):
        """Stable training with consistent batch sizes"""
        if self.model is None:
            self.create_stable_model()
        
        # Create data generators
        train_gen, val_gen = self.create_data_generators(
            X_train, y_train, X_val, y_val, batch_size
        )
        
        # Calculate steps
        steps_per_epoch = len(X_train) // batch_size
        validation_steps = len(X_val) // batch_size
        
        # Callbacks
        callbacks = [
            keras.callbacks.EarlyStopping(
                patience=8, 
                restore_best_weights=True,
                monitor='val_accuracy'
            ),
            keras.callbacks.ReduceLROnPlateau(
                factor=0.3, 
                patience=4,
                monitor='val_loss',
                min_lr=1e-7
            ),
            keras.callbacks.ModelCheckpoint(
                'models/kaggle_pothole_detector_best.h5',
                save_best_only=True,
                monitor='val_accuracy',
                verbose=1
            )
        ]
        
        print("Phase 1: Training with frozen base model...")
        # Initial training with frozen base
        history1 = self.model.fit(
            train_gen,
            steps_per_epoch=steps_per_epoch,
            epochs=initial_epochs,
            validation_data=val_gen,
            validation_steps=validation_steps,
            callbacks=callbacks,
            verbose=1
        )
        
        print("Phase 2: Fine-tuning with unfrozen base model...")
        # Unfreeze base model for fine-tuning
        self.base_model.trainable = True
        
        # Use lower learning rate for fine-tuning
        self.model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.0001),
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        # Fine-tuning with smaller batch size
        fine_tune_batch_size = max(16, batch_size // 2)
        train_gen_ft, val_gen_ft = self.create_data_generators(
            X_train, y_train, X_val, y_val, fine_tune_batch_size
        )
        
        steps_per_epoch_ft = len(X_train) // fine_tune_batch_size
        validation_steps_ft = len(X_val) // fine_tune_batch_size
        
        history2 = self.model.fit(
            train_gen_ft,
            steps_per_epoch=steps_per_epoch_ft,
            epochs=fine_tune_epochs,
            validation_data=val_gen_ft,
            validation_steps=validation_steps_ft,
            callbacks=callbacks,
            verbose=1
        )
        
        # Combine histories
        history = {
            'loss': history1.history['loss'] + history2.history['loss'],
            'accuracy': history1.history['accuracy'] + history2.history['accuracy'],
            'val_loss': history1.history['val_loss'] + history2.history['val_loss'],
            'val_accuracy': history1.history['val_accuracy'] + history2.history['val_accuracy']
        }
        
        return history
    
    def evaluate_detailed(self, X_test, y_test, batch_size=32):
        """Detailed evaluation with consistent batch size"""
        if self.model is None:
            print("Model not trained yet!")
            return
        
        # Predictions in batches to avoid memory issues
        y_pred_proba = []
        for i in range(0, len(X_test), batch_size):
            batch = X_test[i:i+batch_size]
            batch_pred = self.model.predict(batch, verbose=0)
            y_pred_proba.extend(batch_pred)
        
        y_pred_proba = np.array(y_pred_proba)
        y_pred = np.argmax(y_pred_proba, axis=1)
        
        # Classification report
        print("Classification Report:")
        print(classification_report(y_test, y_pred, target_names=self.class_names))
        
        # Confusion matrix
        cm = confusion_matrix(y_test, y_pred)
        print("Confusion Matrix:")
        print(cm)
        
        # Additional metrics
        from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
        
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, average='weighted')
        recall = recall_score(y_test, y_pred, average='weighted')
        f1 = f1_score(y_test, y_pred, average='weighted')
        
        print(f"\nDetailed Metrics:")
        print(f"Accuracy: {accuracy:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall: {recall:.4f}")
        print(f"F1-Score: {f1:.4f}")
        
        # Per-class confidence analysis
        print(f"\nConfidence Analysis:")
        for class_idx, class_name in enumerate(self.class_names):
            class_mask = y_test == class_idx
            if np.any(class_mask):
                class_confidences = y_pred_proba[class_mask, class_idx]
                print(f"{class_name}: mean confidence = {np.mean(class_confidences):.4f}")
        
        return {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1_score': f1,
            'confusion_matrix': cm.tolist(),
            'predictions': y_pred.tolist(),
            'probabilities': y_pred_proba.tolist()
        }
    
    def predict_with_confidence(self, image_path, confidence_threshold=0.7):
        """Enhanced prediction with confidence analysis"""
        if self.model is None:
            print("Model not loaded!")
            return None
        
        try:
            # Load and preprocess image
            img = cv2.imread(image_path)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img = cv2.resize(img, (self.img_width, self.img_height))
            img = img.astype('float32') / 255.0
            img = np.expand_dims(img, axis=0)
            
            # Make prediction
            prediction = self.model.predict(img, verbose=0)
            predicted_class = np.argmax(prediction[0])
            confidence = float(prediction[0][predicted_class])
            
            # Determine reliability
            is_reliable = confidence >= confidence_threshold
            
            # Enhanced severity scoring for potholes
            severity = 0
            if predicted_class == 1:  # pothole detected
                if confidence > 0.95:
                    severity = 5
                elif confidence > 0.85:
                    severity = 4
                elif confidence > 0.75:
                    severity = 3
                elif confidence > 0.65:
                    severity = 2
                else:
                    severity = 1
            
            return {
                'class': self.class_names[predicted_class],
                'confidence': confidence,
                'is_pothole': predicted_class == 1,
                'is_reliable': is_reliable,
                'severity': severity,
                'raw_prediction': prediction[0].tolist(),
                'confidence_threshold': confidence_threshold
            }
            
        except Exception as e:
            print(f"Error predicting image {image_path}: {e}")
            return None
    
    def load_model(self, model_path):
        """Load a saved model"""
        try:
            self.model = keras.models.load_model(model_path)
            print(f"Model loaded from {model_path}")
        except Exception as e:
            print(f"Error loading model: {e}")
            return False
        return True
    
    def save_model_with_metadata(self, model_path='models/kaggle_pothole_detector.h5'):
        """Save model with comprehensive metadata"""
        if self.model is None:
            print("No model to save!")
            return
        
        os.makedirs(os.path.dirname(model_path), exist_ok=True)
        self.model.save(model_path)
        
        # Enhanced metadata
        metadata = {
            'model_name': 'Kaggle Pothole Detector',
            'version': '2.1',
            'class_names': self.class_names,
            'img_height': self.img_height,
            'img_width': self.img_width,
            'model_architecture': 'EfficientNetB0 + Custom Head',
            'framework': 'TensorFlow',
            'training_method': 'Transfer Learning + Fine-tuning',
            'dataset_source': 'Kaggle Annotated Potholes Dataset',
            'preprocessing': 'Resize + Normalize + Data Augmentation',
            'confidence_threshold': 0.7,
            'expected_accuracy': '90-95%',
            'input_format': 'RGB images, 224x224 pixels',
            'output_format': 'Binary classification with confidence scores'
        }
        
        metadata_path = model_path.replace('.h5', '_metadata.json')
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"Model saved to {model_path}")
        print(f"Metadata saved to {metadata_path}")

def main():
    # Set memory growth for GPU if available
    gpus = tf.config.experimental.list_physical_devices('GPU')
    if gpus:
        try:
            for gpu in gpus:
                tf.config.experimental.set_memory_growth(gpu, True)
        except RuntimeError as e:
            print(e)
    
    # Initialize detector
    detector = KagglePotholeDetector()
    
    # Load processed classification dataset
    dataset_path = "data/kaggle_pothole_dataset/processed/classification"
    
    if not os.path.exists(dataset_path):
        print("Processed dataset not found!")
        print("Please run 'python scripts/kaggle_dataset_loader.py' first")
        return
    
    print("Loading processed Kaggle dataset...")
    X, y = detector.load_classification_data(dataset_path)
    
    if len(X) == 0:
        print("No data loaded! Please check the processed dataset.")
        return
    
    print(f"Loaded {len(X)} images")
    print(f"Class distribution: {np.bincount(y)}")
    
    # Split data with stratification
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp
    )
    
    print(f"Training set: {len(X_train)} images")
    print(f"Validation set: {len(X_val)} images")
    print(f"Test set: {len(X_test)} images")
    
    # Create and train model
    print("Creating stable model with transfer learning...")
    detector.create_stable_model()
    detector.model.summary()
    
    print("Training model with stable architecture...")
    history = detector.train_stable(
        X_train, y_train, X_val, y_val,
        initial_epochs=15, fine_tune_epochs=20, batch_size=32
    )
    
    # Evaluate model
    print("Evaluating model...")
    results = detector.evaluate_detailed(X_test, y_test)
    
    # Save model and results
    detector.save_model_with_metadata()
    
    # Save training results
    os.makedirs('models', exist_ok=True)
    results_path = 'models/training_results.json'
    with open(results_path, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"Training completed! Results saved to {results_path}")
    
    # Plot training history
    plt.figure(figsize=(12, 4))
    
    plt.subplot(1, 2, 1)
    plt.plot(history['accuracy'], label='Training Accuracy')
    plt.plot(history['val_accuracy'], label='Validation Accuracy')
    plt.title('Model Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    
    plt.subplot(1, 2, 2)
    plt.plot(history['loss'], label='Training Loss')
    plt.plot(history['val_loss'], label='Validation Loss')
    plt.title('Model Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    
    plt.tight_layout()
    plt.savefig('models/training_history.png')
    plt.show()

if __name__ == "__main__":
    main()
