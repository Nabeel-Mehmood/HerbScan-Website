# classification/classify.py
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress TF debug logs

import sys
import json
import numpy as np
import tensorflow as tf
from PIL import Image

# Load the trained model. (Update the path if needed)
model = tf.keras.models.load_model("C:\\Users\\Sparta Laptop Store\\Desktop\\HerbScan backend Model\\HerbScan_Backend_Model.h5")

# Class labels – update if yours are different
class_names = ['Acacia_Modesta', 'Albizia_Lebbeck', 'Bauhinia_Variegata', 'Unknown']

def preprocess_image(img_path):
    img = Image.open(img_path).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def classify_image(img_path):
    processed_img = preprocess_image(img_path)
    predictions = model.predict(processed_img)[0]
    predicted_index = np.argmax(predictions)
    predicted_class = class_names[predicted_index]
    confidence = float(predictions[predicted_index] * 100)
    return predicted_class, confidence

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)
    img_path = sys.argv[1]
    try:
        predicted_class, confidence = classify_image(img_path)
        result = {"predicted_class": predicted_class, "confidence": confidence}
        # Print ONLY the JSON string.
        sys.stdout.write(json.dumps(result))
    except Exception as e:
        sys.stdout.write(json.dumps({"error": str(e)}))
