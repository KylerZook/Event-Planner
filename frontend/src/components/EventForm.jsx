import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EventForm({ user }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: ''
  });
  const [invitedFriends, setInvitedFriends] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/events', {
        ...formData,
        invitedFriends
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate(`/event/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <div className="event-form-container">
      <h2>Create New Event</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Event Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        {/* TODO: Add friend selection component */}
        <div className="form-group">
          <label>Invite Friends:</label>
          <p>TODO: Add friend selection from your friends list</p>
        </div>

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default EventForm;
