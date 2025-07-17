import sys
import json
import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
import cv2

class KagglePotholeDetector:
    def __init__(self, img_height=224, img_width=224):
        self.img_height = img_height
        self.img_width = img_width
        self.model = None
        self.class_names = ['no_pothole', 'pothole']
    
    def load_model(self, model_path):
        """Load a saved model"""
        try:
            self.model = keras.models.load_model(model_path)
            print(f"Model loaded from {model_path}")
        except Exception as e:
            print(f"Error loading model: {e}")
            return False
        return True
    
    def predict_with_confidence(self, image_path, confidence_threshold=0.7):
        """Enhanced prediction with confidence analysis"""
        if self.model is None:
            print("Model not loaded!")
            return None
        
        try:
            # Load and preprocess image
            img = cv2.imread(image_path)
            if img is None:
                print(f"Could not load image: {image_path}")
                return None
                
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img = cv2.resize(img, (self.img_width, self.img_height))
            img = img.astype('float32') / 255.0
            img = np.expand_dims(img, axis=0)
            
            # Make prediction
            prediction = self.model.predict(img, verbose=0)
            predicted_class = int(np.argmax(prediction[0]))  # Convert to Python int
            confidence = float(prediction[0][predicted_class])  # Convert to Python float
            
            # Determine reliability
            is_reliable = bool(confidence >= confidence_threshold)  # Convert to Python bool
            
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
                'is_pothole': bool(predicted_class == 1),  # Convert to Python bool
                'is_reliable': is_reliable,
                'severity': int(severity),  # Convert to Python int
                'raw_prediction': [float(x) for x in prediction[0]],  # Convert all to Python float
                'confidence_threshold': float(confidence_threshold)
            }
            
        except Exception as e:
            print(f"Error predicting image {image_path}: {e}")
            return None

def main():
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: python predict_image_kaggle.py <image_path>"}))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    try:
        # Initialize detector and load model
        detector = KagglePotholeDetector()
        model_path = os.path.join('models', 'kaggle_pothole_detector.h5')
        
        if not os.path.exists(model_path):
            # Try alternative model path
            alt_model_path = os.path.join('models', 'kaggle_pothole_detector_best.h5')
            if os.path.exists(alt_model_path):
                model_path = alt_model_path
            else:
                result = {
                    "error": "Model not found. Please train the model first.",
                    "model_path": model_path,
                    "alternative_path": alt_model_path,
                    "available_files": os.listdir('models') if os.path.exists('models') else []
                }
                print(json.dumps(result))
                sys.exit(1)
        
        success = detector.load_model(model_path)
        if not success:
            result = {"error": "Failed to load model"}
            print(json.dumps(result))
            sys.exit(1)
        
        # Make enhanced prediction
        prediction = detector.predict_with_confidence(image_path, confidence_threshold=0.7)
        
        if prediction is None:
            result = {"error": "Failed to analyze image"}
        else:
            # Enhanced analysis with Kaggle-specific insights
            result = {
                "prediction": prediction,
                "severity": get_enhanced_severity(prediction),
                "recommendations": get_enhanced_recommendations(prediction),
                "confidence_level": get_confidence_level(prediction['confidence']),
                "reliability": "High" if prediction['is_reliable'] else "Low",
                "action_priority": get_action_priority(prediction),
                "estimated_size": estimate_pothole_size(prediction)
            }
        
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        error_result = {"error": str(e)}
        print(json.dumps(error_result))
        sys.exit(1)

def get_enhanced_severity(prediction):
    """Enhanced severity assessment based on Kaggle dataset insights"""
    if not prediction['is_pothole']:
        return 0
    
    confidence = prediction['confidence']
    base_severity = prediction['severity']
    
    # Adjust based on confidence and reliability
    if prediction['is_reliable']:
        if confidence > 0.95:
            return min(5, base_severity + 1)  # Boost high-confidence predictions
        elif confidence > 0.85:
            return base_severity
        else:
            return max(1, base_severity - 1)  # Reduce lower confidence
    else:
        return max(1, base_severity - 1)  # Reduce unreliable predictions

def get_enhanced_recommendations(prediction):
    """Enhanced recommendations based on Kaggle dataset categories"""
    if not prediction['is_pothole']:
        return [
            "No pothole detected in this image",
            "Continue regular road monitoring",
            "Consider periodic inspections"
        ]
    
    confidence = prediction['confidence']
    severity = prediction['severity']
    recommendations = []
    
    # Confidence-based recommendations
    if not prediction['is_reliable']:
        recommendations.extend([
            "⚠️ Low confidence detection - manual verification required",
            "Consider taking additional photos from different angles",
            "Schedule expert inspection to confirm"
        ])
    
    # Severity-based recommendations
    if severity >= 4:
        recommendations.extend([
            "🚨 URGENT: Immediate repair required",
            "Deploy safety barriers around the area",
            "Notify emergency road maintenance team",
            "Consider temporary road closure if necessary"
        ])
    elif severity >= 3:
        recommendations.extend([
            "⚡ HIGH PRIORITY: Schedule repair within 24-48 hours",
            "Place warning signs around the pothole",
            "Monitor for rapid deterioration",
            "Prepare repair materials and crew"
        ])
    elif severity >= 2:
        recommendations.extend([
            "📋 MEDIUM PRIORITY: Schedule repair within 1 week",
            "Add to maintenance work queue",
            "Monitor size and depth changes",
            "Consider temporary patching if worsening"
        ])
    else:
        recommendations.extend([
            "📝 LOW PRIORITY: Schedule routine repair",
            "Document for future maintenance planning",
            "Monitor during regular inspections",
            "Consider preventive measures for surrounding area"
        ])
    
    # Additional technical recommendations
    if confidence > 0.8:
        recommendations.append("✅ High confidence detection - proceed with recommended actions")
    
    return recommendations

def get_confidence_level(confidence):
    """Enhanced confidence level assessment"""
    if confidence > 0.95:
        return "Excellent"
    elif confidence > 0.85:
        return "Very High"
    elif confidence > 0.75:
        return "High"
    elif confidence > 0.65:
        return "Medium"
    elif confidence > 0.55:
        return "Low"
    else:
        return "Very Low"

def get_action_priority(prediction):
    """Determine action priority based on prediction"""
    if not prediction['is_pothole']:
        return "None"
    
    if not prediction['is_reliable']:
        return "Verification Required"
    
    severity = prediction['severity']
    if severity >= 4:
        return "Emergency"
    elif severity >= 3:
        return "High"
    elif severity >= 2:
        return "Medium"
    else:
        return "Low"

def estimate_pothole_size(prediction):
    """Estimate pothole size category based on confidence patterns"""
    if not prediction['is_pothole']:
        return "N/A"
    
    confidence = prediction['confidence']
    
    # Based on Kaggle dataset patterns (this is an approximation)
    if confidence > 0.9:
        return "Large"  # High confidence often indicates clear, large potholes
    elif confidence > 0.75:
        return "Medium"
    else:
        return "Small"  # Lower confidence might indicate smaller or less clear potholes

if __name__ == "__main__":
    main()
