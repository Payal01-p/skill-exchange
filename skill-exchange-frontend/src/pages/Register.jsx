import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = `http://${window.location.hostname}:5000`;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    bio: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/api/auth/register`, formData);
      toast.success('Registration successful! You can now log in.');

      setFormData({
        name: '',
        email: '',
        password: '',
        location: '',
        bio: '',
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm border-0 bg-light">
        <div className="card-body">
          <h3 className="text-center mb-4 text-dark fw-semibold">Join Skill Exchange</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="text"
                name="name"
                className="form-control"
                id="nameInput"
                placeholder="Payal Sharma"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label htmlFor="nameInput">Full Name</label>
            </div>

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

            <div className="form-floating mb-3">
              <input
                type="text"
                name="location"
                className="form-control"
                id="locationInput"
                placeholder="Goa, India"
                value={formData.location}
                onChange={handleChange}
              />
              <label htmlFor="locationInput">Location</label>
            </div>

            <div className="form-floating mb-3">
              <textarea
                name="bio"
                className="form-control"
                id="bioInput"
                placeholder="Tell us a bit about yourself..."
                style={{ height: '100px' }}
                value={formData.bio}
                onChange={handleChange}
              />
              <label htmlFor="bioInput">Short Bio</label>
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
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-3 text-muted">
            Already have an account?{' '}
            <a href="/login" className="text-decoration-none">Log in here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;