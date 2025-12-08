import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FriendSearch from './FriendSearch';

function Dashboard({ user, onLogout }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFriendSearch, setShowFriendSearch] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/users/${user.id}/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header>
        <h1>Welcome, {user.username}!</h1>
        <nav>
          <Link to={`/profile/${user.id}`}>
            <button className="secondary">My Profile</button>
          </Link>
          <button onClick={() => setShowFriendSearch(true)}>Find Friends</button>
          <Link to="/event/create">
            <button>Create Event</button>
          </Link>
          <button className="secondary" onClick={onLogout}>Logout</button>
        </nav>
      </header>

      <FriendSearch
        isOpen={showFriendSearch}
        onClose={() => setShowFriendSearch(false)}
      />

      <main>
        <h2>Your Events</h2>

        {events.length === 0 ? (
          <p>No events yet. Create your first event!</p>
        ) : (
          <div className="events-list">
            {events.map(event => (
              <div key={event._id} className="event-card">
                <h3>{event.title}</h3>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Location: {event.location}</p>
                <p>Host: {event.host?.username}</p>
                <Link to={`/event/${event._id}`}>View Details</Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
