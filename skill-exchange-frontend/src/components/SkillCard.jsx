import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SkillCard = ({ skill }) => {
  const navigate = useNavigate();

  const posterName =
    skill.postedBy?.name ||
    skill.postedBy?.email ||
    skill.postedBy?._id ||
    'Anonymous';

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(skill.comments || []);
  const [submitting, setSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('authToken');
      const res = await axios.post(
        `http://localhost:5000/api/skills/${skill._id}/comment`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setComments(res.data.comments);
      setCommentText('');
      setShowAll(true); // Show all after posting
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConnect = () => {
    navigate(`/chat/${skill.postedBy?._id}`);
  };

  const visibleComments = showAll ? comments : comments.slice(0, 3);

  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">{skill.title || 'Untitled Skill'}</h5>
        <p className="card-text">{skill.description || 'No description provided.'}</p>

        <p className="card-text">
          <strong>Category:</strong> {skill.category || 'Uncategorized'}
        </p>
        <p className="card-text">
          <strong>Location:</strong> {skill.location || 'Unknown'}
        </p>
        <p className="card-text">
          <strong>Type:</strong> {skill.type || 'N/A'}
        </p>

        <p className="card-text">
          <small className="text-muted">Posted by: {posterName}</small>
        </p>

        {/* 💬 Comments Section */}
        <hr />
        <h6>Comments</h6>
        {comments.length === 0 ? (
          <p className="text-muted">No comments yet.</p>
        ) : (
          <>
            <ul className="list-unstyled">
              {visibleComments.map((comment, idx) => (
                <li key={idx}>
                  <strong>{comment.postedBy?.name || 'Anonymous'}:</strong> {comment.text}
                </li>
              ))}
            </ul>
            {comments.length > 3 && !showAll && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setShowAll(true)}
              >
                Show more comments
              </button>
            )}
          </>
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
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>

        {/* 🔗 Connect Button */}
        <button className="btn btn-outline-primary mt-3" onClick={handleConnect}>
          Connect
        </button>
      </div>
    </div>
  );
};

export default SkillCard;