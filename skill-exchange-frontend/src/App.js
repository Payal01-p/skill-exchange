import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateSkill from './pages/CreateSkill';
import Register from './pages/Register';
import ProtectedRoute from './utils/ProtectedRoute';
import Navbar from './components/Navbar';
import AuthProvider from './context/AuthContext'; // 👈 Import this
import { ToastContainer } from 'react-toastify';
import MyPosts from './pages/MyPosts';
import EditPost from './pages/EditPost'; // 👈 Import EditPost component
import ChatPage from './pages/ChatPage';
import Notifications from './pages/Notifications';


function App() {
  return (
    <AuthProvider> {/* 👈 Wrap everything inside AuthProvider */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="/notifications" element={<Notifications />} />
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
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />

      </Router>
    </AuthProvider>
  );
}

export default App;