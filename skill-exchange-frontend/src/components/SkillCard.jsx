import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const BASE_URL = `http://${window.location.hostname}:5000`;

const SkillCard = ({ skill }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const posterName =
    skill.postedBy?.name ||
    skill.postedBy?.email ||
    skill.postedBy?._id ||
    'Anonymous';

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(skill.comments || []);
  const [submitting, setSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('authToken');
      const res = await axios.post(
        `${BASE_URL}/api/skills/${skill._id}/comment`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setComments(res.data.comments);
      setCommentText('');
      setShowComments(true);
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConnect = () => {
    navigate(`/profile/${skill.postedBy?._id}`);
  };

  const handleConnectAndChat = async () => {
    const initiatorEmail = user?.email;
    const targetEmail = skill?.postedBy?.email;

    if (!initiatorEmail || !targetEmail) {
      console.error('❌ Missing emails:', { initiatorEmail, targetEmail });
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/chats/seed`, {
        initiatorEmail,
        targetEmail
      });

      navigate('/chat');
    } catch (err) {
      console.error('❌ Failed to initiate chat:', err.response?.data || err.message);
    }
  };

  return (
    <div className="card h-100 border-0 shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="card-body">
        <h5 className="card-title text-dark fw-semibold">{skill.title || 'Untitled Skill'}</h5>
        <p className="card-text text-muted">{skill.description || 'No description provided.'}</p>

        <ul className="list-unstyled mb-3">
          <li><strong>Category:</strong> {skill.category || 'Uncategorized'}</li>
          <li><strong>Location:</strong> {skill.location || 'Unknown'}</li>
          <li><strong>Type:</strong> {skill.type || 'N/A'}</li>
        </ul>

        <p className="card-text">
          <small className="text-muted">Posted by: {posterName}</small>
        </p>

        {/* 🔄 Toggle Comments */}
        <button
          className="btn btn-sm btn-outline-dark mb-3"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>

        {/* 💬 Comments Section */}
        {showComments && (
          <>
            <h6 className="text-dark">Comments</h6>
            {comments.length === 0 ? (
              <p className="text-muted">No comments yet.</p>
            ) : (
              <ul className="list-group list-group-flush">
                {comments.map((comment, idx) => (
                  <li key={idx} className="list-group-item px-0">
                    <strong>{comment.postedBy?.name || 'Anonymous'}:</strong> {comment.text}
                  </li>
                ))}
              </ul>
            )}

            {/* 📝 Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mt-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={submitting}
                />
                <button className="btn btn-dark" type="submit" disabled={submitting}>
                  {submitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </>
        )}

        {/* 🔗 Connect Buttons */}
        <button
          className="btn btn-outline-dark mt-4 w-100"
          onClick={handleConnect}
        >
          View Profile
        </button>
        <button
          className="btn btn-success mt-2 w-100"
          onClick={handleConnectAndChat}
        >
          Connect & Chat
        </button>
      </div>
    </div>
  );
};

export default SkillCard;