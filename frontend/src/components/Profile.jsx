import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Profile({ user }) {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="profile-container">
      <h2>{profile.username}'s Profile</h2>
      <p>Email: {profile.email}</p>

      <section>
        <h3>Friends ({profile.friends?.length || 0})</h3>
        {/* TODO: Implement FriendList component */}
        <div className="friends-list">
          {profile.friends?.map(friend => (
            <div key={friend._id}>{friend.username}</div>
          ))}
        </div>
      </section>

      <section>
        <h3>Pending Requests ({profile.pendingRequests?.length || 0})</h3>
        {/* TODO: Implement pending requests display */}
      </section>

      {/* TODO: Add FriendSearch component */}
    </div>
  );
}

export default Profile;
