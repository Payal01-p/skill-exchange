import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SkillCard from '../components/SkillCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    location: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('http://localhost:5000/api/me', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        setUser(res.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams(filters).toString();
        const res = await axios.get(`http://localhost:5000/api/skills?${query}`);
        const visibleSkills = res.data.filter(skill => !skill.hidden);
        setSkills(visibleSkills);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSkills();
    }
  }, [filters, user]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-4">
      <h2>
        Welcome{user?.name ? `, ${user.name}` : ''} 👋
      </h2>
      <button className="btn btn-success mb-4" onClick={() => navigate('/create')}>
        Post a Skill
      </button>

      {/* 🔍 Filter Controls */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label>Category</label>
          <select
            name="category"
            className="form-control"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="Design">Design</option>
            <option value="Coding">Coding</option>
            <option value="Writing">Writing</option>
          </select>
        </div>
        <div className="col-md-4">
          <label>Type</label>
          <select
            name="type"
            className="form-control"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="offer">Offer</option>
            <option value="request">Request</option>
          </select>
        </div>
        <div className="col-md-4">
          <label>Location</label>
          <input
            type="text"
            name="location"
            className="form-control"
            placeholder="Enter location"
            value={filters.location}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* 🌍 All Skill Posts */}
      <h4>Explore Skills</h4>
      {loading ? (
        <p>Loading skills...</p>
      ) : skills.length === 0 ? (
        <p>No skill posts found.</p>
      ) : (
        <div className="row">
          {skills.map((skill) => (
            <div className="col-md-4 mb-3" key={skill._id}>
              <SkillCard skill={skill} currentUser={user} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;