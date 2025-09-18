import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext'; // ✅ Optional: use context

const CreateSkill = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'offer', // or 'request'
  });

  // ✅ Option 1: Use context (preferred if you're already using AuthContext)
  const { authToken } = useContext(AuthContext);

  // ✅ Option 2: Fallback to localStorage if needed
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
      await axios.post('http://localhost:5000/api/skills', formData, {
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
    <div className="container mt-4">
      <h2>Create Skill</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Type</label>
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
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default CreateSkill;