import os
import json
import cv2
import numpy as np
import pandas as pd
from pathlib import Path
import zipfile
import requests
from typing import Dict, List, Tuple, Optional
import xml.etree.ElementTree as ET

class KagglePotholeDatasetLoader:
    def __init__(self, dataset_path: str = "data/kaggle_pothole_dataset"):
        self.dataset_path = Path(dataset_path)
        self.images_path = self.dataset_path / "images"
        self.annotations_path = self.dataset_path / "annotations"
        self.processed_path = self.dataset_path / "processed"
        
        # Create directories
        self.dataset_path.mkdir(parents=True, exist_ok=True)
        self.processed_path.mkdir(parents=True, exist_ok=True)
    
    def download_dataset(self):
        """
        Instructions for downloading the Kaggle dataset
        """
        print("To download the Kaggle dataset:")
        print("1. Go to: https://www.kaggle.com/datasets/chitholian/annotated-potholes-dataset")
        print("2. Click 'Download' button")
        print("3. Extract the downloaded zip file to:", self.dataset_path)
        print("4. Make sure the structure looks like:")
        print("   data/kaggle_pothole_dataset/")
        print("   ├── images/")
        print("   ├── annotations/")
        print("   └── ...")
        print("\nAlternatively, use Kaggle API:")
        print("pip install kaggle")
        print("kaggle datasets download -d chitholian/annotated-potholes-dataset")
        
    def parse_annotations(self) -> Dict[str, List[Dict]]:
        """
        Parse annotation files (assuming PASCAL VOC format or similar)
        """
        annotations = {}
        
        # Check for different annotation formats
        annotation_files = list(self.annotations_path.glob("*.xml")) + \
                          list(self.annotations_path.glob("*.json")) + \
                          list(self.annotations_path.glob("*.txt"))
        
        if not annotation_files:
            print("No annotation files found. Checking for CSV files...")
            csv_files = list(self.dataset_path.glob("*.csv"))
            if csv_files:
                return self.parse_csv_annotations(csv_files[0])
        
        for ann_file in annotation_files:
            if ann_file.suffix == '.xml':
                annotations.update(self.parse_xml_annotation(ann_file))
            elif ann_file.suffix == '.json':
                annotations.update(self.parse_json_annotation(ann_file))
            elif ann_file.suffix == '.txt':
                annotations.update(self.parse_txt_annotation(ann_file))
        
        return annotations
    
    def parse_xml_annotation(self, xml_file: Path) -> Dict[str, List[Dict]]:
        """Parse PASCAL VOC XML annotation"""
        tree = ET.parse(xml_file)
        root = tree.getroot()
        
        filename = root.find('filename').text
        annotations = []
        
        for obj in root.findall('object'):
            name = obj.find('name').text
            bbox = obj.find('bndbox')
            
            annotation = {
                'class': name,
                'bbox': {
                    'xmin': int(bbox.find('xmin').text),
                    'ymin': int(bbox.find('ymin').text),
                    'xmax': int(bbox.find('xmax').text),
                    'ymax': int(bbox.find('ymax').text)
                }
            }
            annotations.append(annotation)
        
        return {filename: annotations}
    
    def parse_json_annotation(self, json_file: Path) -> Dict[str, List[Dict]]:
        """Parse JSON annotation (COCO format or similar)"""
        with open(json_file, 'r') as f:
            data = json.load(f)
        
        annotations = {}
        
        # Handle different JSON formats
        if 'images' in data and 'annotations' in data:
            # COCO format
            image_id_to_filename = {img['id']: img['file_name'] for img in data['images']}
            
            for ann in data['annotations']:
                image_id = ann['image_id']
                filename = image_id_to_filename[image_id]
                
                if filename not in annotations:
                    annotations[filename] = []
                
                bbox = ann['bbox']  # [x, y, width, height]
                annotation = {
                    'class': data['categories'][ann['category_id'] - 1]['name'],
                    'bbox': {
                        'xmin': int(bbox[0]),
                        'ymin': int(bbox[1]),
                        'xmax': int(bbox[0] + bbox[2]),
                        'ymax': int(bbox[1] + bbox[3])
                    }
                }
                annotations[filename].append(annotation)
        
        return annotations
    
    def parse_csv_annotations(self, csv_file: Path) -> Dict[str, List[Dict]]:
        """Parse CSV annotation file"""
        df = pd.read_csv(csv_file)
        annotations = {}
        
        for _, row in df.iterrows():
            filename = row['filename'] if 'filename' in row else row['image_name']
            
            if filename not in annotations:
                annotations[filename] = []
            
            # Assuming CSV has columns: filename, class, xmin, ymin, xmax, ymax
            annotation = {
                'class': row['class'] if 'class' in row else 'pothole',
                'bbox': {
                    'xmin': int(row['xmin']),
                    'ymin': int(row['ymin']),
                    'xmax': int(row['xmax']),
                    'ymax': int(row['ymax'])
                }
            }
            annotations[filename].append(annotation)
        
        return annotations
    
    def create_classification_dataset(self, annotations: Dict[str, List[Dict]], 
                                    output_size: Tuple[int, int] = (224, 224)):
        """
        Create classification dataset from bounding box annotations
        """
        classification_path = self.processed_path / "classification"
        pothole_path = classification_path / "pothole"
        no_pothole_path = classification_path / "no_pothole"
        
        pothole_path.mkdir(parents=True, exist_ok=True)
        no_pothole_path.mkdir(parents=True, exist_ok=True)
        
        pothole_count = 0
        no_pothole_count = 0
        
        # Process images with potholes
        for filename, anns in annotations.items():
            image_path = self.images_path / filename
            if not image_path.exists():
                continue
            
            image = cv2.imread(str(image_path))
            if image is None:
                continue
            
            # Extract pothole regions
            for i, ann in enumerate(anns):
                bbox = ann['bbox']
                pothole_region = image[bbox['ymin']:bbox['ymax'], 
                                     bbox['xmin']:bbox['xmax']]
                
                if pothole_region.size > 0:
                    # Resize and save pothole region
                    pothole_resized = cv2.resize(pothole_region, output_size)
                    output_filename = f"pothole_{pothole_count:06d}_{filename}"
                    cv2.imwrite(str(pothole_path / output_filename), pothole_resized)
                    pothole_count += 1
            
            # Create negative samples (regions without potholes)
            self.create_negative_samples(image, anns, no_pothole_path, 
                                       filename, output_size, no_pothole_count)
            no_pothole_count += len(anns) * 2  # Create 2 negative samples per positive
        
        print(f"Created classification dataset:")
        print(f"  Pothole images: {pothole_count}")
        print(f"  No pothole images: {no_pothole_count}")
        
        return classification_path
    
    def create_negative_samples(self, image: np.ndarray, annotations: List[Dict], 
                              output_path: Path, filename: str, 
                              output_size: Tuple[int, int], start_count: int):
        """Create negative samples by extracting regions without potholes"""
        h, w = image.shape[:2]
        
        # Get all pothole bounding boxes
        pothole_boxes = [ann['bbox'] for ann in annotations]
        
        samples_created = 0
        max_attempts = 50
        
        for attempt in range(max_attempts):
            if samples_created >= len(annotations) * 2:
                break
            
            # Random region
            region_w, region_h = output_size[0] * 2, output_size[1] * 2
            x = np.random.randint(0, max(1, w - region_w))
            y = np.random.randint(0, max(1, h - region_h))
            
            candidate_box = {
                'xmin': x, 'ymin': y,
                'xmax': x + region_w, 'ymax': y + region_h
            }
            
            # Check if this region overlaps with any pothole
            if not self.boxes_overlap(candidate_box, pothole_boxes):
                region = image[y:y+region_h, x:x+region_w]
                if region.size > 0:
                    region_resized = cv2.resize(region, output_size)
                    output_filename = f"no_pothole_{start_count + samples_created:06d}_{filename}"
                    cv2.imwrite(str(output_path / output_filename), region_resized)
                    samples_created += 1
    
    def boxes_overlap(self, box1: Dict, box2_list: List[Dict], threshold: float = 0.1) -> bool:
        """Check if box1 overlaps with any box in box2_list"""
        for box2 in box2_list:
            # Calculate intersection
            x1 = max(box1['xmin'], box2['xmin'])
            y1 = max(box1['ymin'], box2['ymin'])
            x2 = min(box1['xmax'], box2['xmax'])
            y2 = min(box1['ymax'], box2['ymax'])
            
            if x2 > x1 and y2 > y1:
                intersection = (x2 - x1) * (y2 - y1)
                box1_area = (box1['xmax'] - box1['xmin']) * (box1['ymax'] - box1['ymin'])
                
                if intersection / box1_area > threshold:
                    return True
        
        return False
    
    def analyze_dataset(self, annotations: Dict[str, List[Dict]]):
        """Analyze the dataset and print statistics"""
        total_images = len(annotations)
        total_potholes = sum(len(anns) for anns in annotations.values())
        
        # Count by class
        class_counts = {}
        size_distribution = {'small': 0, 'medium': 0, 'large': 0}
        
        for filename, anns in annotations.items():
            for ann in anns:
                class_name = ann['class'].lower()
                class_counts[class_name] = class_counts.get(class_name, 0) + 1
                
                # Estimate size based on bounding box area
                bbox = ann['bbox']
                area = (bbox['xmax'] - bbox['xmin']) * (bbox['ymax'] - bbox['ymin'])
                
                if area < 1000:
                    size_distribution['small'] += 1
                elif area < 5000:
                    size_distribution['medium'] += 1
                else:
                    size_distribution['large'] += 1
        
        print("Dataset Analysis:")
        print(f"  Total images: {total_images}")
        print(f"  Total annotations: {total_potholes}")
        print(f"  Average annotations per image: {total_potholes/total_images:.2f}")
        print(f"  Class distribution: {class_counts}")
        print(f"  Size distribution: {size_distribution}")
        
        return {
            'total_images': total_images,
            'total_annotations': total_potholes,
            'class_counts': class_counts,
            'size_distribution': size_distribution
        }

def main():
    # Initialize dataset loader
    loader = KagglePotholeDatasetLoader()
    
    # Check if dataset exists
    if not loader.images_path.exists():
        print("Dataset not found!")
        loader.download_dataset()
        return
    
    print("Loading Kaggle Pothole Dataset...")
    
    # Parse annotations
    annotations = loader.parse_annotations()
    
    if not annotations:
        print("No annotations found! Please check the dataset structure.")
        return
    
    # Analyze dataset
    stats = loader.analyze_dataset(annotations)
    
    # Create classification dataset
    print("\nCreating classification dataset...")
    classification_path = loader.create_classification_dataset(annotations)
    
    print(f"\nClassification dataset created at: {classification_path}")
    print("You can now use this dataset with the training script!")

if __name__ == "__main__":
    main()
