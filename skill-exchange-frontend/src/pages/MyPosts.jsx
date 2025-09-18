import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SkillCard from '../components/SkillCard';
import { useNavigate } from 'react-router-dom';

const MyPosts = () => {
  const [mySkills, setMySkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('http://localhost:5000/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchMySkills = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('http://localhost:5000/api/skills', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const mine = res.data.filter((skill) => skill.postedBy?._id === user?._id);
      setMySkills(mine);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/api/skills/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMySkills((prev) => prev.filter((skill) => skill._id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMySkills();
    }
  }, [user]);

  return (
    <div className="container mt-4">
      <h2>Your Skill Posts</h2>
      {loading ? (
        <p>Loading your posts...</p>
      ) : mySkills.length === 0 ? (
        <p className="text-muted">You haven’t posted any skills yet.</p>
      ) : (
        <div className="row">
          {mySkills.map((skill) => (
            <div className="col-md-4 mb-3" key={skill._id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{skill.title}</h5>
                  <p className="card-text">{skill.description}</p>
                  <p className="card-text">
                    <strong>Category:</strong> {skill.category}
                  </p>
                  <p className="card-text">
                    <strong>Location:</strong> {skill.location}
                  </p>
                  <p className="card-text">
                    <strong>Type:</strong> {skill.type}
                  </p>

                  {/* 🛠️ Edit & Delete Buttons */}
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate(`/edit/${skill._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
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