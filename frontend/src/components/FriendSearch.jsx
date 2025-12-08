import { useState } from 'react';
import axios from 'axios';

function FriendSearch({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage('');
    setSearching(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/users/search?q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(response.data);
      if (response.data.length === 0) {
        setMessage('No users found');
      }
      setSearching(false);
    } catch (error) {
      setMessage('Error searching users');
      setSearching(false);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/users/${userId}/friend-request`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Friend request sent!');
      // Remove user from search results
      setSearchResults(searchResults.filter(user => user._id !== userId));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send request');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="friend-search-modal" onClick={onClose}>
      <div className="friend-search-content" onClick={(e) => e.stopPropagation()}>
        <h2>Find Friends</h2>

        {message && <div className="message">{message}</div>}

        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search by username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button type="submit" disabled={searching}>
            {searching ? 'Searching...' : 'Search'}
          </button>
          <button type="button" className="secondary" onClick={onClose}>
            Close
          </button>
        </form>

        <div className="search-results">
          {searchResults.map(user => (
            <div key={user._id} className="user-result">
              <span>{user.username} ({user.email})</span>
              <button onClick={() => sendFriendRequest(user._id)}>
                Add Friend
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FriendSearch;
