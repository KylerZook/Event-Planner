import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function Profile({ user }) {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const isOwnProfile = user.id === id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleAcceptFriend = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/users/${friendId}/accept-friend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Friend request accepted!');
      fetchProfile(); // Refresh to show updated friends list
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to accept friend request');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="profile-container">
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/dashboard">
          <button className="secondary">← Dashboard</button>
        </Link>
        <Link to="/event/create">
          <button className="secondary">Create Event</button>
        </Link>
      </nav>

      <h2>{profile.username}'s Profile</h2>
      <p><strong>Email:</strong> {profile.email}</p>

      {message && <div className="message">{message}</div>}

      {isOwnProfile && profile.pendingRequests && profile.pendingRequests.length > 0 && (
        <section style={{ marginTop: '30px', marginBottom: '30px' }}>
          <h3>Friend Requests ({profile.pendingRequests.length})</h3>
          <div className="search-results">
            {profile.pendingRequests.map(request => (
              <div key={request._id} className="user-result">
                <span>{request.username} ({request.email})</span>
                <button onClick={() => handleAcceptFriend(request._id)}>
                  Accept
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ marginTop: '30px' }}>
        <h3>Friends ({profile.friends?.length || 0})</h3>
        {profile.friends && profile.friends.length > 0 ? (
          <div className="search-results">
            {profile.friends.map(friend => (
              <div key={friend._id} className="user-result">
                <span>{friend.username} ({friend.email})</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No friends yet. {isOwnProfile ? "Use the Find Friends button to connect with others!" : ""}</p>
        )}
      </section>
    </div>
  );
}

export default Profile;
