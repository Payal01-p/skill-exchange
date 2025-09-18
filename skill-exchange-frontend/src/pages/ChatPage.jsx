import React, { useState } from 'react';
import axios from 'axios';

const ChatPage = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [confirmed, setConfirmed] = useState(false);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const token = localStorage.getItem('authToken');
    const newMessage = { sender: 'You', text };

    setMessages([...messages, newMessage]);
    setText('');

    // Optional: send to backend
  };

  const confirmTeaching = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put('http://localhost:5000/api/skills/hide', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConfirmed(true);
    } catch (error) {
      console.error('Failed to confirm teaching:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h4>Chat with the teacher</h4>
      {!confirmed ? (
        <button className="btn btn-success mb-3" onClick={confirmTeaching}>
          Confirm Teaching
        </button>
      ) : (
        <p className="text-success">Teaching confirmed. Post hidden.</p>
      )}

      <div className="border p-3 mb-3" style={{ minHeight: '200px' }}>
        {messages.map((msg, idx) => (
          <p key={idx}><strong>{msg.sender}:</strong> {msg.text}</p>
        ))}
      </div>

      <div className="input-group">
        <input
          type="text"
          className="form-control"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="btn btn-primary" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;