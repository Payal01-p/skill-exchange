import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = `http://${window.location.hostname}:5000`;

const MyPosts = () => {
  const [mySkills, setMySkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMySkills = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`${BASE_URL}/api/skills/mine`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMySkills(res.data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMySkills();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${BASE_URL}/api/skills/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMySkills((prev) => prev.filter((skill) => skill._id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-dark fw-semibold">Your Skill Posts</h3>
      {loading ? (
        <div className="alert alert-secondary">Loading your posts...</div>
      ) : mySkills.length === 0 ? (
        <div className="alert alert-warning">You haven’t posted any skills yet.</div>
      ) : (
        <div className="row">
          {mySkills.map((skill) => (
            <div className="col-md-4 mb-4" key={skill._id}>
              <div className="card h-100 shadow-sm border-0" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="card-body">
                  <h5 className="card-title text-dark">{skill.title}</h5>
                  <p className="card-text text-muted">{skill.description}</p>
                  <ul className="list-unstyled mb-3">
                    <li><strong>Category:</strong> {skill.category}</li>
                    <li><strong>Location:</strong> {skill.location}</li>
                    <li><strong>Type:</strong> {skill.type}</li>
                  </ul>

                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => navigate(`/edit/${skill._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(skill._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;