from flask import Flask, request, jsonify, url_for
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from flask_cors import CORS
from flask import send_from_directory

app = Flask(__name__)
CORS(app)

# Load your trained model
model = load_model('model/model.h5')

# Define categories (update this based on your model training)
CATEGORIES = [
    'backpack', 'cap', 'Casual', 'Handbag', 'hoodie',
    'jeans', 'pants', 'polo_tshirt', 'shoes',
    'shorts', 'skirt', 'tshirt'
]

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')


@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        return jsonify({"error": "Unsupported file type"}), 400

    # Save uploaded image
    file_path = os.path.join('static', 'uploaded_image.jpg')
    file.save(file_path)

    try:
        # Preprocess the image
        img = image.load_img(file_path, target_size=(224, 224))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Predict the category
        predictions = model.predict(img_array)
        predicted_index = np.argmax(predictions)
        predicted_class = CATEGORIES[predicted_index]
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

    # Get similar images
    similar_images_folder = os.path.join('static', 'images', predicted_class)

    if not os.path.exists(similar_images_folder) or not os.listdir(similar_images_folder):
        return jsonify({"error": "No similar images found"}), 404

    similar_images = os.listdir(similar_images_folder)
    similar_image_paths = [
        url_for('static', filename=f'images/{predicted_class}/{img}', _external=True)
        for img in similar_images
    ]

    return jsonify({
        "category": predicted_class,
        "similar_images": similar_image_paths
    })

@app.route('/dataset/items/<category>', methods=['GET'])
def get_items(category):
    if category not in CATEGORIES:
        return jsonify({"error": "Invalid category"}), 400

    items_folder = os.path.join('static', 'images', category)

    if not os.path.exists(items_folder) or not os.listdir(items_folder):
        return jsonify({"error": "No images found for this category"}), 404

    items_images = os.listdir(items_folder)
    item_image_paths = [
        url_for('static', filename=f'images/{category}/{img}', _external=True)
        for img in items_images
    ]

    return jsonify({"items": item_image_paths})

if __name__ == '__main__':
    app.run(debug=True)
