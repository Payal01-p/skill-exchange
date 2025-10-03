import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

// ✅ Bootstrap JS (needed for toggle functionality)
import 'bootstrap/dist/js/bootstrap.bundle.min';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.info('You’ve been logged out.');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
  };

  const hasUnread = user?.unreadCount > 0;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to={isAuthenticated ? '/dashboard' : '/'}>
          Skill Exchange
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {isAuthenticated ? (
              <>
                <li className="nav-item mx-2 text-white">
                  <span className="fw-semibold">Welcome, {user?.name || 'User'}!</span>
                </li>
                <li className="nav-item mx-2">
                  <NavLink to="/create" className="nav-link">Create Skill</NavLink>
                </li>
                <li className="nav-item mx-2">
                  <NavLink to="/match" className="nav-link">Smart Match</NavLink>
                </li>
                <li className="nav-item mx-2">
                  <NavLink to="/my-posts" className="nav-link">Your Posts</NavLink>
                </li>
                <li className="nav-item mx-2">
                  <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
                </li>
                <li className="nav-item mx-2 position-relative">
                  <NavLink to="/chat" className="nav-link position-relative">
                    Chat
                    {hasUnread && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-4px',
                          right: '-12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          borderRadius: '50%',
                          padding: '2px 6px',
                          fontSize: '12px',
                          lineHeight: '1',
                        }}
                      >
                        {user.unreadCount}
                      </span>
                    )}
                  </NavLink>
                </li>
                <li className="nav-item mx-2">
                  <button className="btn btn-outline-light" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item mx-2">
                  <NavLink to="/login" className="nav-link">Login</NavLink>
                </li>
                <li className="nav-item mx-2">
                  <NavLink to="/register" className="nav-link">Register</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;