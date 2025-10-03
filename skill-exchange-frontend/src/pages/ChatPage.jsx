import React, { useState } from 'react';
import ChatList from '../components/ChatList';
import ChatBox from '../components/ChatBox';

const ChatPage = ({ user, token }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="container mt-4">
      <div
        className="d-flex flex-wrap"
        style={{
          gap: '20px',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        {/* Chat List */}
        <div style={{ flex: '1 1 30%', minWidth: '250px', borderRight: '1px solid #ccc', paddingRight: '10px' }}>
          <h5>Chats</h5>
          <ChatList user={user} token={token} onSelectChat={setSelectedUser} />
        </div>

        {/* Chat Box */}
        <div style={{ flex: '1 1 65%', minWidth: '300px' }}>
          {selectedUser ? (
            <ChatBox user={user} partner={selectedUser} token={token} />
          ) : (
            <div style={{ padding: '20px', color: '#666' }}>
              <h6>Select a chat to start messaging</h6>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;