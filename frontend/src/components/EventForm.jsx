import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function EventForm({ user }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: ''
  });
  const [invitedFriends, setInvitedFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch user's friends when component loads
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFriends(response.data.friends || []);
        setLoadingFriends(false);
      } catch (error) {
        console.error('Error fetching friends:', error);
        setLoadingFriends(false);
      }
    };

    fetchFriends();
  }, [user.id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFriendToggle = (friendId) => {
    if (invitedFriends.includes(friendId)) {
      // Remove friend from invited list
      setInvitedFriends(invitedFriends.filter(id => id !== friendId));
    } else {
      // Add friend to invited list
      setInvitedFriends([...invitedFriends, friendId]);
    }
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
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/dashboard">
          <button type="button" className="secondary">← Dashboard</button>
        </Link>
        <Link to={`/profile/${user.id}`}>
          <button type="button" className="secondary">My Profile</button>
        </Link>
      </nav>

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

        <div className="form-group">
          <label>Invite Friends:</label>
          {loadingFriends ? (
            <p>Loading friends...</p>
          ) : friends.length === 0 ? (
            <p>You don't have any friends yet. Add friends to invite them to events!</p>
          ) : (
            <div className="friends-checklist">
              {friends.map(friend => (
                <div key={friend._id} className="friend-checkbox">
                  <input
                    type="checkbox"
                    id={`friend-${friend._id}`}
                    checked={invitedFriends.includes(friend._id)}
                    onChange={() => handleFriendToggle(friend._id)}
                  />
                  <label htmlFor={`friend-${friend._id}`}>
                    {friend.username} ({friend.email})
                  </label>
                </div>
              ))}
              <p className="invite-count">
                {invitedFriends.length} friend{invitedFriends.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}
        </div>

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default EventForm;
