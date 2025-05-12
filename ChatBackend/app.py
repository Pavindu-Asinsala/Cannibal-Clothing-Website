from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import chatbot  # Import AI chatbot

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        print(f"📩 Received request: {data}")  # Debug log

        if not data or "message" not in data:
            print("❌ Invalid request: 'message' key missing")
            return jsonify({"error": "Invalid request! 'message' key is missing."}), 400

        user_input = data["message"].strip()
        if not user_input:
            print("⚠️ User sent an empty message")
            return jsonify({"reply": "🤖 Please enter a message!"}), 400

        bot_response = chatbot.get_response(user_input)
        print(f"🤖 AI Response: {bot_response}")  # Debug log

        return jsonify({"reply": bot_response})

    except Exception as e:
        print(f"❌ Server error: {e}")
        return jsonify({"error": "⚠️ Something went wrong on the server"}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)
