import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const BASE_URL = `http://${window.location.hostname}:5000`;

const CreateSkill = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'offer',
  });

  const { authToken } = useContext(AuthContext);
  const token = authToken || localStorage.getItem('authToken');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Authentication token not found. Please log in.');
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/skills`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Skill post created successfully!');
      setFormData({
        title: '',
        description: '',
        category: '',
        type: 'offer',
      });
    } catch (error) {
      console.error('Error creating skill post:', error);
      toast.error(
        error.response?.data?.error || 'Something went wrong while submitting the form.'
      );
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="card-body">
          <h3 className="mb-4 text-dark fw-semibold">Create a New Skill Post</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="text"
                name="title"
                className="form-control"
                id="titleInput"
                placeholder="Skill Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <label htmlFor="titleInput">Title</label>
            </div>

            <div className="form-floating mb-3">
              <textarea
                name="description"
                className="form-control"
                id="descriptionInput"
                placeholder="Skill Description"
                style={{ height: '120px' }}
                value={formData.description}
                onChange={handleChange}
                required
              />
              <label htmlFor="descriptionInput">Description</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="text"
                name="category"
                className="form-control"
                id="categoryInput"
                placeholder="Skill Category"
                value={formData.category}
                onChange={handleChange}
                required
              />
              <label htmlFor="categoryInput">Category</label>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Type</label>
              <select
                name="type"
                className="form-select"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="offer">Offer</option>
                <option value="request">Request</option>
              </select>
            </div>

            <button type="submit" className="btn btn-dark w-100">
              Submit Skill
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSkill;