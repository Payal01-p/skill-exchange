import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
        const res = await axios.get(`http://localhost:5000/api/skills/${id}`, {
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
      await axios.put(`http://localhost:5000/api/skills/${id}`, post, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Post updated successfully!');
      navigate('/my-posts');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post.');
    }
  };

  if (loading) return <div className="container mt-4"><p>Loading post...</p></div>;
  if (notFound) return <div className="container mt-4"><p className="text-danger">Post not found.</p></div>;

  return (
    <div className="container mt-4">
      <h2>Edit Your Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea
            name="description"
            value={post.description}
            onChange={handleChange}
            className="form-control"
            rows="4"
            required
          />
        </div>
        <div className="mb-3">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={post.category}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={post.location}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>Type</label>
          <select
            name="type"
            value={post.type}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select type</option>
            <option value="offer">Offer</option>
            <option value="request">Request</option>
          </select>
        </div>
        <button type="submit" className="btn btn-success">Update Post</button>
      </form>
    </div>
  );
};

export default EditPost;