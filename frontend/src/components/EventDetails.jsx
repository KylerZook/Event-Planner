import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function EventDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvent(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
      setLoading(false);
    }
  };

  const handleRSVP = async (status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/events/${id}/rsvp`, {
        rsvpStatus: status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvent(); // Refresh event details
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  const isHost = event.host._id === user.id;
  const userAttendee = event.attendees.find(a => a.user._id === user.id);

  return (
    <div className="event-details-container">
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/dashboard">
          <button className="secondary">← Dashboard</button>
        </Link>
        <Link to={`/profile/${user.id}`}>
          <button className="secondary">My Profile</button>
        </Link>
        <Link to="/event/create">
          <button className="secondary">Create Event</button>
        </Link>
      </nav>

      <h2>{event.title}</h2>

      <div className="event-info">
        <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Host:</strong> {event.host.username}</p>
        <p><strong>Description:</strong> {event.description || 'No description provided'}</p>
      </div>

      {!isHost && userAttendee && (
        <div className="rsvp-section">
          <h3>Your RSVP: {userAttendee.rsvpStatus}</h3>
          <div className="rsvp-buttons">
            <button onClick={() => handleRSVP('Attending')}>Attending</button>
            <button onClick={() => handleRSVP('Not Attending')}>Not Attending</button>
          </div>
        </div>
      )}

      <div className="attendees-section">
        <h3>Attendees ({event.attendees.length})</h3>
        <div className="attendees-list">
          {event.attendees.map(attendee => (
            <div key={attendee._id} className="attendee-item">
              <span>{attendee.user.username}</span>
              <span className={`status ${attendee.rsvpStatus.toLowerCase().replace(' ', '-')}`}>
                {attendee.rsvpStatus}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isHost && (
        <div className="host-actions">
          <button onClick={handleDelete} className="delete-button">Delete Event</button>
        </div>
      )}
    </div>
  );
}

export default EventDetails;
