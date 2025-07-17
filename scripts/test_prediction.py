import os
import json
import subprocess
import sys

def test_model_prediction():
    """Test the prediction script with various scenarios"""
    
    print("🧪 Testing Pothole Detection Model")
    print("=" * 50)
    
    # Check if model exists
    model_paths = [
        'models/kaggle_pothole_detector.h5',
        'models/kaggle_pothole_detector_best.h5'
    ]
    
    model_found = False
    for model_path in model_paths:
        if os.path.exists(model_path):
            print(f"✅ Model found: {model_path}")
            model_found = True
            break
    
    if not model_found:
        print("❌ No trained model found!")
        print("Please train the model first using:")
        print("python scripts/train_pothole_model_kaggle_fixed.py")
        return
    
    # Test with sample images
    test_images = []
    
    # Look for test images in various locations
    possible_locations = [
        'data/kaggle_pothole_dataset/',
        'data/processed_kaggle_dataset/test/pothole/',
        'data/processed_kaggle_dataset/test/no_pothole/',
        'data/test_samples/'
    ]
    
    for location in possible_locations:
        if os.path.exists(location):
            for file in os.listdir(location):
                if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                    test_images.append(os.path.join(location, file))
                    if len(test_images) >= 5:  # Limit to 5 test images
                        break
        if len(test_images) >= 5:
            break
    
    if not test_images:
        print("❌ No test images found!")
        print("Please ensure you have test images in one of these locations:")
        for location in possible_locations:
            print(f"  - {location}")
        return
    
    print(f"📸 Found {len(test_images)} test images")
    print()
    
    # Test each image
    for i, image_path in enumerate(test_images, 1):
        print(f"🔍 Testing image {i}: {os.path.basename(image_path)}")
        print("-" * 30)
        
        try:
            # Run prediction script
            result = subprocess.run([
                sys.executable, 
                'scripts/predict_image_kaggle.py', 
                image_path
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                try:
                    prediction_result = json.loads(result.stdout)
                    
                    if 'error' in prediction_result:
                        print(f"❌ Error: {prediction_result['error']}")
                    else:
                        pred = prediction_result['prediction']
                        print(f"🎯 Prediction: {pred['class']}")
                        print(f"📊 Confidence: {pred['confidence']:.3f}")
                        print(f"⚡ Severity: {prediction_result['severity']}")
                        print(f"🔒 Reliability: {prediction_result['reliability']}")
                        print(f"📋 Priority: {prediction_result['action_priority']}")
                        print(f"📏 Size: {prediction_result['estimated_size']}")
                        
                        if pred['is_pothole']:
                            print("🚨 POTHOLE DETECTED!")
                        else:
                            print("✅ No pothole detected")
                            
                except json.JSONDecodeError:
                    print(f"❌ Invalid JSON response: {result.stdout}")
            else:
                print(f"❌ Script failed: {result.stderr}")
                
        except subprocess.TimeoutExpired:
            print("❌ Prediction timed out")
        except Exception as e:
            print(f"❌ Error running prediction: {e}")
        
        print()
    
    print("🏁 Testing completed!")

if __name__ == "__main__":
    test_model_prediction()
