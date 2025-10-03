// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const http = require('http');
// const { Server } = require('socket.io');

// const chatRoutes = require('./routes/chatRoutes');

// const app = express();

// // ✅ CORS for frontend origin
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));

// app.use(express.json());

// // ✅ API Routes
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/skills', require('./routes/skillRoutes'));
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/me', require('./routes/meRoutes'));
// app.use('/api/match', require('./routes/matchRoutes'));
// app.use('/api/messages', require('./routes/messageRoutes'));
// app.use('/api/chats', chatRoutes);

// // ✅ MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     const PORT = process.env.PORT || 5000;

//     // ✅ Create HTTP server and attach Socket.io
//     const server = http.createServer(app);
//     const io = new Server(server, {
//       cors: {
//         origin: 'http://localhost:3000',
//         methods: ['GET', 'POST'],
//       },
//     });

//     // ✅ Track connected users
//     const onlineUsers = new Map();

//     io.on('connection', (socket) => {
//       console.log('🟢 New client connected:', socket.id);

//       // ✅ Join user-specific room
//       socket.on('registerUser', (userId) => {
//         if (userId) {
//           socket.join(userId);
//           onlineUsers.set(userId, socket.id);
//           console.log(`👤 User ${userId} registered to socket ${socket.id}`);
//         }
//       });

//       // ✅ Handle message sending
//       socket.on('sendMessage', ({ senderId, receiverId, message }) => {
//         console.log(`📤 Message from ${senderId} to ${receiverId}: ${message}`);

//         // ✅ Emit to receiver only
//         io.to(receiverId).emit('receiveMessage', {
//           senderId,
//           receiverId,
//           message,
//         });
//       });

//       socket.on('disconnect', () => {
//         console.log('🔴 Client disconnected:', socket.id);
//         for (let [userId, socketId] of onlineUsers.entries()) {
//           if (socketId === socket.id) {
//             onlineUsers.delete(userId);
//             break;
//           }
//         }
//       });
//     });

//     server.listen(PORT, () => {
//       console.log(`🚀 Server running with Socket.io on port ${PORT}`);
//     });
//   })
//   .catch(err => {
//     console.error('❌ MongoDB connection failed:', err.message);
//     process.exit(1);
//   });











//updated
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const os = require('os');

const chatRoutes = require('./routes/chatRoutes');
const app = express();

// ✅ Dynamically detect LAN IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return null;
}

const localIP = getLocalIP();
console.log(`🌐 Detected LAN IP: ${localIP}`);

const allowedOrigins = [
  `http://localhost:3000`,
  `http://${localIP}:3000`
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ✅ API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/me', require('./routes/meRoutes'));
app.use('/api/match', require('./routes/matchRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/chats', chatRoutes);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    const onlineUsers = new Map();

    io.on('connection', (socket) => {
      console.log('🟢 New client connected:', socket.id);

      socket.on('registerUser', (userId) => {
        if (userId) {
          socket.join(userId);
          onlineUsers.set(userId, socket.id);
          console.log(`👤 User ${userId} registered to socket ${socket.id}`);
        }
      });

      socket.on('sendMessage', ({ senderId, receiverId, message }) => {
        console.log(`📤 Message from ${senderId} to ${receiverId}: ${message}`);
        io.to(receiverId).emit('receiveMessage', {
          senderId,
          receiverId,
          message,
        });
      });

      socket.on('disconnect', () => {
        console.log('🔴 Client disconnected:', socket.id);
        for (let [userId, socketId] of onlineUsers.entries()) {
          if (socketId === socket.id) {
            onlineUsers.delete(userId);
            break;
          }
        }
      });
    });

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running with Socket.io on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });