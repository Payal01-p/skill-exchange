import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContext, AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateSkill from './pages/CreateSkill';
import MyPosts from './pages/MyPosts';
import EditPost from './pages/EditPost';
import SmartMatch from './pages/SmartMatch';
import ChatBox from './components/ChatBox';
import ChatPage from './pages/ChatPage';

const AppRoutes = () => {
  const { user, token } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-posts" element={<MyPosts />} />
      <Route path="/edit/:id" element={<EditPost />} />
      <Route path="/chat/:partnerId" element={<ChatBox />} />
      <Route path="/chat" element={<ChatPage user={user} token={token} />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateSkill />
          </ProtectedRoute>
        }
      />
      <Route path="/match" element={<SmartMatch />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={1000} />
      </Router>
    </AuthProvider>
  );
}

export default App;