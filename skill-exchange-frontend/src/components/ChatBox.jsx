import React, { useEffect, useState, useContext, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const BASE_URL = `http://${window.location.hostname}:5000`;
const socket = io(BASE_URL);

const ChatBox = ({ partner }) => {
  const { user } = useContext(AuthContext);
  const currentUserId = user?._id;
  const partnerId = partner?._id;

  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentUserId) {
      socket.emit('registerUser', currentUserId);
    }
  }, [currentUserId]);

  useEffect(() => {
    const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
    if (!user || !isValidId(currentUserId) || !isValidId(partnerId)) {
      console.error('❌ Invalid user IDs — skipping fetch');
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/messages/${currentUserId}/${partnerId}`);
        setChat(res.data);
        scrollToBottom();

        // ✅ Clear unread status for current user
        await axios.post(`${BASE_URL}/api/messages/${currentUserId}/${partnerId}`);
      } catch (err) {
        console.error('❌ Failed to load messages:', err.response?.data || err.message);
      }
    };

    fetchMessages();

    const handleReceive = (data) => {
      if (data.sender === partnerId) {
        setChat((prev) => [...prev, { sender: partnerId, content: data.content }]);
        scrollToBottom();
      }
    };

    socket.on('receiveMessage', handleReceive);

    return () => {
      socket.off('receiveMessage', handleReceive);
    };
  }, [user, currentUserId, partnerId]);

  const sendMessage = async () => {
    const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
    if (!message.trim()) return;
    if (!isValidId(currentUserId) || !isValidId(partnerId)) {
      console.error('❌ Cannot send message: invalid IDs');
      return;
    }

    const newMsg = {
      sender: currentUserId,
      receiver: partnerId,
      content: message,
    };

    socket.emit('sendMessage', newMsg);

    try {
      await axios.post(`${BASE_URL}/api/messages`, newMsg);
      setChat((prev) => [...prev, { sender: currentUserId, content: message }]);
      setMessage('');
      scrollToBottom();
    } catch (err) {
      console.error('❌ Failed to send message:', err.response?.data || err.message);
    }
  };

  if (!user) {
    return <div className="text-center mt-5">🔒 Please log in to use chat.</div>;
  }

  return (
    <div className="card shadow-sm mt-4 mx-auto" style={{ maxWidth: '500px' }}>
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Chat with {partner?.name || 'Partner'}</h5>
      </div>
      <div className="card-body" style={{ height: '300px', overflowY: 'auto' }}>
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`d-flex mb-2 ${
              msg.sender === currentUserId ? 'justify-content-end' : 'justify-content-start'
            }`}
          >
            <div
              className={`p-2 rounded ${
                msg.sender === currentUserId ? 'bg-success text-white' : 'bg-light'
              }`}
              style={{ maxWidth: '70%' }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="card-footer">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button className="btn btn-primary" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;