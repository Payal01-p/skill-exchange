import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = `http://${window.location.hostname}:5000`;

const ChatList = ({ user, token, onSelectChat }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);
    if (!user?._id || !isValidId(user._id)) return;

    const fetchChats = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/chats/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChats(res.data);
      } catch (err) {
        console.error('❌ Failed to load chat list:', err.response?.data || err.message);
      }
    };

    fetchChats();
  }, [user, token]);

  return (
    <div className="chat-list">
      <h4>Chats</h4>
      {chats.length === 0 && <p>No chats yet</p>}
      {chats.map(chat => (
        <div
          key={chat.chatId}
          className="chat-item"
          onClick={() => onSelectChat(chat.user)}
          style={{
            cursor: 'pointer',
            padding: '10px',
            borderBottom: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            marginBottom: '5px',
            borderRadius: '4px',
            position: 'relative'
          }}
        >
          <strong>{chat.user?.name || 'Unknown User'}</strong>
          <p style={{
            margin: '4px 0',
            color: '#555',
            fontWeight: chat.unread ? 'bold' : 'normal'
          }}>
            {chat.lastMessage?.slice(0, 50)}{chat.lastMessage?.length > 50 ? '...' : ''}
          </p>
          <small>{chat.timestamp ? new Date(chat.timestamp).toLocaleString() : ''}</small>

          {chat.unread && (
            <span
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#dc3545',
                color: 'white',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '12px'
              }}
            >
              New
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatList;