from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient("mongodb+srv://Radhika:Radhika@cluster.urbb9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster")
db = client.chat_app
users_collection = db.users
messages_collection = db.messages

@app.route("/hello", methods=["POST","GET"])
def hello():
    return jsonify({"message":"hello"})

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    
    if users_collection.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 400
    
    users_collection.insert_one({"username": username})
    return jsonify({"message": "User registered successfully"}), 201

@app.route("/send_message", methods=["POST"])
def send_message():
    data = request.json
    username = data.get("username")
    content = data.get("content")
    
    if not content or not username:
        return jsonify({"error": "Missing content or username"}), 400
    
    message = {
        "username": username,
        "content": content,
        "timestamp": datetime.now().isoformat()
    }
    messages_collection.insert_one(message)
    return jsonify({"message": "Message sent"}), 201

@app.route("/get_messages", methods=["GET"])
def get_messages():
    messages = list(messages_collection.find().sort("timestamp", 1))
    for message in messages:
        message["_id"] = str(message["_id"])  # Convert ObjectId to string
    return jsonify(messages), 200

if __name__ == "__main__":
    app.run(debug=True)
