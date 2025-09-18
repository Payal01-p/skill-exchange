// pages/Notifications.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('http://localhost:5000/api/messages/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    };

    fetchMessages();
  }, []);

  const handleOpenChat = async (msg) => {
    const token = localStorage.getItem('authToken');
    await axios.put(`http://localhost:5000/api/messages/read/${msg._id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate(`/chat/${msg.sender._id}`);
  };

  return (
    <div className="container mt-4">
      <h4>New Messages</h4>
      {messages.length === 0 ? (
        <p>No new messages.</p>
      ) : (
        <ul className="list-group">
          {messages.map((msg) => (
            <li key={msg._id} className="list-group-item d-flex justify-content-between align-items-center">
              <span><strong>{msg.sender.name}</strong>: {msg.text}</span>
              <button className="btn btn-sm btn-primary" onClick={() => handleOpenChat(msg)}>Open Chat</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;