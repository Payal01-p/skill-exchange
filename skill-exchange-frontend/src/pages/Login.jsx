import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const BASE_URL = `http://${window.location.hostname}:5000`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, formData);
      const { token, user } = response.data;

      if (!token || !user || !user._id) {
        throw new Error('Invalid login response');
      }

      login(token, user); // ✅ Store both token and user
      toast.success('Login successful!');
      const redirectPath = location.state?.from?.pathname || '/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm border-0 bg-light">
        <div className="card-body">
          <h3 className="text-center mb-4 text-dark fw-semibold">Welcome Back</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="email"
                name="email"
                className="form-control"
                id="emailInput"
                placeholder="payal@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="emailInput">Email Address</label>
            </div>

            <div className="form-floating mb-4">
              <input
                type="password"
                name="password"
                className="form-control"
                id="passwordInput"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label htmlFor="passwordInput">Password</label>
            </div>

            <button type="submit" className="btn btn-dark w-100" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="text-center mt-3 text-muted">
            New here? <a href="/register" className="text-decoration-none">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;