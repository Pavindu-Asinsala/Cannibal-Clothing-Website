from transformers import BlenderbotTokenizer, TFBlenderbotForConditionalGeneration
import tensorflow as tf
import json
import os

# Suppress TensorFlow logging
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

class Chatbot:
    def __init__(self):
        model_name = "facebook/blenderbot-400M-distill"
        print("🔄 Loading BlenderBot model...")
        self.tokenizer = BlenderbotTokenizer.from_pretrained(model_name)
        self.model = TFBlenderbotForConditionalGeneration.from_pretrained(model_name)
        print("✅ Model loaded successfully.")
        
        # Load Training Data
        self.qa_data = self.load_training_data("training_data.json")

    def load_training_data(self, file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as file:
                return json.load(file)
        except Exception as e:
            print("❌ Error loading training data:", e)
            return []

    def get_response(self, user_input):
        user_input = user_input.strip().lower()

        # Check if input matches any pre-trained responses
        for qa in self.qa_data:
            if user_input == qa["input"].strip().lower():
                return qa["output"]  # Return custom response

        # Otherwise, use AI model for a response
        inputs = self.tokenizer(user_input, return_tensors="tf")
        output = self.model.generate(**inputs)
        response = self.tokenizer.decode(output[0], skip_special_tokens=True)
        
        return response.strip()

# Initialize chatbot
chatbot = Chatbot()
