import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BASE_URL = `http://${window.location.hostname}:5000`;

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    type: ''
  });

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`${BASE_URL}/api/skills/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPost(res.data);
      } catch (error) {
        console.error('Error fetching post:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${BASE_URL}/api/skills/${id}`, post, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Post updated successfully!');
      navigate('/my-posts');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post.');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="alert alert-secondary">Loading post...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Post not found.</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="card-body">
          <h3 className="mb-4 text-dark fw-semibold">Edit Your Skill Post</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="text"
                name="title"
                className="form-control"
                id="titleInput"
                placeholder="Title"
                value={post.title}
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
                placeholder="Description"
                style={{ height: '120px' }}
                value={post.description}
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
                placeholder="Category"
                value={post.category}
                onChange={handleChange}
              />
              <label htmlFor="categoryInput">Category</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="text"
                name="location"
                className="form-control"
                id="locationInput"
                placeholder="Location"
                value={post.location}
                onChange={handleChange}
              />
              <label htmlFor="locationInput">Location</label>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Type</label>
              <select
                name="type"
                className="form-select"
                value={post.type}
                onChange={handleChange}
              >
                <option value="">Select type</option>
                <option value="offer">Offer</option>
                <option value="request">Request</option>
              </select>
            </div>

            <button type="submit" className="btn btn-dark w-100">
              Update Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;