import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = `http://${window.location.hostname}:5000`;

const SmartMatch = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`${BASE_URL}/api/match`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatches(res.data);
        console.log('Matches:', res.data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-4 fw-semibold">Smart Matches</h3>
      {loading ? (
        <div className="alert alert-dark">Finding your matches...</div>
      ) : matches.length === 0 ? (
        <div className="alert alert-warning">No matches found yet. Try updating your skills!</div>
      ) : (
        <div className="row">
          {matches.map((user) => (
            <div className="col-md-4 mb-4" key={user._id}>
              <div className="card h-100 shadow-sm border border-primary">
                <div className="card-body">
                  <h5 className="card-title">{user.name}</h5>
                  <p className="card-text text-secondary">{user.location}</p>
                  <div>
                    <strong>Offers:</strong>
                    <ul className="list-unstyled">
                      {user.skillsOffered.map((skill, i) => (
                        <li key={i}>🛠️ {skill}</li>
                      ))}
                    </ul>
                    <strong>Needs:</strong>
                    <ul className="list-unstyled">
                      {user.skillsNeeded.map((skill, i) => (
                        <li key={i}>🎯 {skill}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-3">
                    <span className="badge bg-success">Rating: {user.rating.toFixed(1)}</span>
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

export default SmartMatch;