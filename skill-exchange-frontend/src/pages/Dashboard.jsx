import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SkillCard from '../components/SkillCard';
import { useNavigate } from 'react-router-dom';

const BASE_URL = `http://${window.location.hostname}:5000`;

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
        const res = await axios.get(`${BASE_URL}/api/me`, {
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
        const res = await axios.get(`${BASE_URL}/api/skills?${query}`);
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
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">
          Welcome{user?.name ? `, ${user.name}` : ''} 👋
        </h2>
        <button className="btn btn-dark" onClick={() => navigate('/create')}>
          Post a Skill
        </button>
      </div>

      {/* 🔍 Filter Controls */}
      <div className="card shadow-sm border-0 mb-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="card-body">
          <h5 className="mb-3 text-dark fw-semibold">Filter Skills</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="form-floating">
                <select
                  name="category"
                  className="form-select"
                  value={filters.category}
                  onChange={handleFilterChange}
                  id="categorySelect"
                >
                  <option value="">All</option>
                  <option value="Design">Design</option>
                  <option value="Coding">Coding</option>
                  <option value="Writing">Writing</option>
                </select>
                <label htmlFor="categorySelect">Category</label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-floating">
                <select
                  name="type"
                  className="form-select"
                  value={filters.type}
                  onChange={handleFilterChange}
                  id="typeSelect"
                >
                  <option value="">All</option>
                  <option value="offer">Offer</option>
                  <option value="request">Request</option>
                </select>
                <label htmlFor="typeSelect">Type</label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-floating">
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  id="locationInput"
                />
                <label htmlFor="locationInput">Location</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🌍 All Skill Posts */}
      <h4 className="mb-3 text-dark fw-semibold">Explore Skills</h4>
      {loading ? (
        <div className="text-muted">Loading skills...</div>
      ) : skills.length === 0 ? (
        <div className="text-muted">No skill posts found.</div>
      ) : (
        <div className="row">
          {skills.map((skill) => (
            <div className="col-md-4 mb-4" key={skill._id}>
              <SkillCard skill={skill} currentUser={user} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;