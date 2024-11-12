import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://127.0.0.1:5000";

function App() {
  const [username, setUsername] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/get_messages`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 2000); // Poll for messages every 2 seconds
    return () => clearInterval(intervalId);
  }, []);

  const handleRegister = async () => {
    try {
      await axios.post(`${API_URL}/register`, { username });
      setIsRegistered(true);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleMessageSend = async () => {
    if (!message) return;

    try {
      await axios.post(`${API_URL}/send_message`, { username, content: message });
      setMessage("");
    } catch (error) {
      console.error("Message sending error:", error);
    }
  };

  return (
    <div className="app-container">
      <div className="chat-container">
        <h2>Chat Application</h2>
        {!isRegistered ? (
          <div className="register-container">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
            />
            <button onClick={handleRegister} className="button">Register</button>
          </div>
        ) : (
          <div className="chat-section">
            <div className="messages-container">
              {messages.map((msg) => (
                <div key={msg._id} className={`message ${msg.username === username ? "own-message" : ""}`}>
                  <strong>{msg.username}</strong>: {msg.content}
                  <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
            <div className="input-container">
              <input
                type="text"
                placeholder="Type your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-field"
              />
              <button onClick={handleMessageSend} className="button">Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
