# Event Planner - Detailed Implementation Guide

This guide provides step-by-step instructions for implementing each feature of the Event Planner application.

---

## Table of Contents

1. [Phase 1: Foundation](#phase-1-foundation)
2. [Phase 2: Core Features](#phase-2-core-features)
3. [Phase 3: Polish & Presentation](#phase-3-polish--presentation)
4. [Component Implementation Details](#component-implementation-details)
5. [API Implementation Details](#api-implementation-details)

---

## Phase 1: Foundation

### Backend Setup (Christian, Sydney)

#### Step 1: Install Dependencies
```bash
cd backend
npm install
```

#### Step 2: Create .env File
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-planner
JWT_SECRET=your-super-secret-jwt-key-change-this
```

#### Step 3: Test Backend Server
```bash
npm run dev
```

Expected output:
```
✅ Server is running on port 5000
✅ MongoDB Connected: localhost
```

#### Step 4: Test User Registration
Use Postman or curl:
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@test.com",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "test@test.com"
  }
}
```

#### Step 5: Test User Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "password123"
  }'
```

### Frontend Setup (Kyler, Paddy)

#### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

#### Step 2: Start Development Server
```bash
npm run dev
```

Expected output:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

#### Step 3: Test Registration Flow
1. Navigate to http://localhost:3000
2. Click "Sign Up"
3. Fill in registration form
4. Submit and verify redirect to dashboard

#### Step 4: Test Login Flow
1. Logout (or use new browser window)
2. Click "Login"
3. Enter credentials
4. Verify redirect to dashboard

---

## Phase 2: Core Features

### Feature 1: Event Creation (All Team Members)

#### Backend Implementation (Christian, Sydney)

**File: `backend/routes/events.js`**

The basic POST `/api/events` route is already implemented. Test it:

```bash
# Get your token from login response
TOKEN="your-jwt-token-here"

# Create an event
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Birthday Party",
    "date": "2024-12-25T18:00:00",
    "location": "123 Main St",
    "description": "Come celebrate!",
    "invitedFriends": []
  }'
```

#### Frontend Implementation (Kyler, Paddy)

**File: `frontend/src/components/EventForm.jsx`**

The form is already created, but you need to add friend selection. Update the component:

```jsx
// Add this state
const [friends, setFriends] = useState([]);

// Fetch user's friends on component mount
useEffect(() => {
  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr);

      const response = await axios.get(`/api/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFriends(response.data.friends || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  fetchFriends();
}, []);

// Add friend selection in the form
<div className="form-group">
  <label>Invite Friends:</label>
  <div className="friends-checklist">
    {friends.map(friend => (
      <div key={friend._id}>
        <input
          type="checkbox"
          id={friend._id}
          checked={invitedFriends.includes(friend._id)}
          onChange={(e) => {
            if (e.target.checked) {
              setInvitedFriends([...invitedFriends, friend._id]);
            } else {
              setInvitedFriends(invitedFriends.filter(id => id !== friend._id));
            }
          }}
        />
        <label htmlFor={friend._id}>{friend.username}</label>
      </div>
    ))}
  </div>
</div>
```

### Feature 2: Friend Management

#### Backend: Send Friend Request (Christian)

**File: `backend/routes/users.js`**

Replace the TODO in the friend-request endpoint:

```javascript
// POST /api/users/:id/friend-request - Send friend request
router.post('/:id/friend-request', authenticateToken, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const requesterId = req.user.id;

    // Can't send request to yourself
    if (targetUserId === requesterId) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    // Check if already friends
    const requester = await User.findById(requesterId);
    if (requester.friends.includes(targetUserId)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    // Check if request already sent
    const targetUser = await User.findById(targetUserId);
    if (targetUser.pendingRequests.includes(requesterId)) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Add to pending requests
    await User.findByIdAndUpdate(targetUserId, {
      $push: { pendingRequests: requesterId }
    });

    res.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

#### Backend: Accept Friend Request (Sydney)

**File: `backend/routes/users.js`**

Replace the TODO in the accept-friend endpoint:

```javascript
// POST /api/users/:id/accept-friend - Accept friend request
router.post('/:id/accept-friend', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const friendId = req.params.id;

    // Verify the friend request exists
    const currentUser = await User.findById(currentUserId);
    if (!currentUser.pendingRequests.includes(friendId)) {
      return res.status(400).json({ message: 'No friend request from this user' });
    }

    // Add to friends for both users
    await User.findByIdAndUpdate(currentUserId, {
      $push: { friends: friendId },
      $pull: { pendingRequests: friendId }
    });

    await User.findByIdAndUpdate(friendId, {
      $push: { friends: currentUserId }
    });

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

#### Frontend: Friend Search Component (Kyler, Paddy)

**Create new file: `frontend/src/components/FriendSearch.jsx`**

```jsx
import { useState } from 'react';
import axios from 'axios';

function FriendSearch({ currentUserId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      // You'll need to create this endpoint
      const response = await axios.get(`/api/users/search?q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/users/${userId}/friend-request`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Friend request sent!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send request');
    }
  };

  return (
    <div className="friend-search">
      <h3>Find Friends</h3>
      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="search-results">
        {searchResults.map(user => (
          <div key={user._id} className="user-result">
            <span>{user.username}</span>
            <button onClick={() => sendFriendRequest(user._id)}>
              Add Friend
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendSearch;
```

**Backend: User Search Endpoint (Christian)**

Add to `backend/routes/users.js`:

```javascript
// GET /api/users/search - Search for users
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const query = req.query.q;

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ],
      _id: { $ne: req.user.id } // Exclude current user
    }).select('username email').limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

#### Frontend: Friend List Component (Dami)

**Create new file: `frontend/src/components/FriendList.jsx`**

```jsx
import axios from 'axios';

function FriendList({ friends, pendingRequests, onAcceptFriend }) {
  return (
    <div className="friend-list">
      {pendingRequests && pendingRequests.length > 0 && (
        <div className="pending-requests">
          <h4>Pending Friend Requests</h4>
          {pendingRequests.map(user => (
            <div key={user._id} className="friend-request">
              <span>{user.username}</span>
              <button onClick={() => onAcceptFriend(user._id)}>Accept</button>
            </div>
          ))}
        </div>
      )}

      <div className="friends">
        <h4>Your Friends ({friends.length})</h4>
        {friends.map(friend => (
          <div key={friend._id} className="friend-item">
            <span>{friend.username}</span>
            <span>{friend.email}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendList;
```

**Update Profile.jsx to use FriendList and FriendSearch:**

```jsx
import FriendList from './FriendList';
import FriendSearch from './FriendSearch';

// In the Profile component
const handleAcceptFriend = async (friendId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(`/api/users/${friendId}/accept-friend`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchProfile(); // Refresh to show updated friends list
  } catch (error) {
    console.error('Error accepting friend:', error);
  }
};

// In the return JSX
<FriendList
  friends={profile.friends}
  pendingRequests={profile.pendingRequests}
  onAcceptFriend={handleAcceptFriend}
/>
<FriendSearch currentUserId={user.id} />
```

---

## Phase 3: Polish & Presentation

### Task 1: Add Remaining Components (Kyler, Paddy)

#### RSVPButton Component

**Create: `frontend/src/components/RSVPButton.jsx`**

```jsx
function RSVPButton({ currentStatus, onRSVP }) {
  return (
    <div className="rsvp-buttons">
      <button
        className={currentStatus === 'Attending' ? 'active' : ''}
        onClick={() => onRSVP('Attending')}
      >
        ✓ Attending
      </button>
      <button
        className={currentStatus === 'Not Attending' ? 'active' : ''}
        onClick={() => onRSVP('Not Attending')}
      >
        ✗ Not Attending
      </button>
    </div>
  );
}

export default RSVPButton;
```

#### AttendeeList Component

**Create: `frontend/src/components/AttendeeList.jsx`**

```jsx
function AttendeeList({ attendees }) {
  const attending = attendees.filter(a => a.rsvpStatus === 'Attending');
  const notAttending = attendees.filter(a => a.rsvpStatus === 'Not Attending');
  const pending = attendees.filter(a => a.rsvpStatus === 'Pending');

  return (
    <div className="attendee-list">
      <h3>Guest List ({attendees.length})</h3>

      {attending.length > 0 && (
        <div className="attending">
          <h4>✓ Attending ({attending.length})</h4>
          {attending.map(a => (
            <div key={a._id}>{a.user.username}</div>
          ))}
        </div>
      )}

      {pending.length > 0 && (
        <div className="pending">
          <h4>? Pending ({pending.length})</h4>
          {pending.map(a => (
            <div key={a._id}>{a.user.username}</div>
          ))}
        </div>
      )}

      {notAttending.length > 0 && (
        <div className="not-attending">
          <h4>✗ Not Attending ({notAttending.length})</h4>
          {notAttending.map(a => (
            <div key={a._id}>{a.user.username}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AttendeeList;
```

### Task 2: Enhanced Styling (Dami)

**Update `frontend/src/index.css`** with complete styling:

```css
/* Add these enhanced styles */

/* Navigation */
nav {
  display: flex;
  gap: 15px;
  align-items: center;
}

nav a {
  text-decoration: none;
  color: #007bff;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a:hover {
  background-color: #e7f3ff;
}

/* Dashboard */
.dashboard-container header {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Event Details */
.event-info {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.rsvp-section {
  background: #f0f8ff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.attendee-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: white;
  margin-bottom: 8px;
  border-radius: 4px;
}

.status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status.attending {
  background-color: #d4edda;
  color: #155724;
}

.status.not-attending {
  background-color: #f8d7da;
  color: #721c24;
}

.status.pending {
  background-color: #fff3cd;
  color: #856404;
}

/* Responsive Design */
@media (max-width: 768px) {
  .events-list {
    grid-template-columns: 1fr;
  }

  nav {
    flex-direction: column;
  }
}
```

### Task 3: Testing & Documentation

#### Create Test Plan

**Create: `TESTING.md`**

```markdown
# Testing Checklist

## User Authentication
- [ ] Register new user with valid data
- [ ] Try to register with duplicate username
- [ ] Try to register with duplicate email
- [ ] Login with correct credentials
- [ ] Try login with wrong password
- [ ] Verify JWT token stored in localStorage
- [ ] Verify protected routes redirect when not logged in

## Events
- [ ] Create event without inviting anyone
- [ ] Create event with invited friends
- [ ] View event details as host
- [ ] View event details as invited guest
- [ ] RSVP as "Attending"
- [ ] RSVP as "Not Attending"
- [ ] Change RSVP status
- [ ] Delete event as host
- [ ] Verify non-host cannot delete event

## Friends
- [ ] Search for users
- [ ] Send friend request
- [ ] Accept friend request
- [ ] View friends list
- [ ] Verify only friends can be invited to events

## Edge Cases
- [ ] Try to befriend yourself
- [ ] Send duplicate friend request
- [ ] Create event with past date
- [ ] Submit forms with missing required fields
- [ ] Test with very long text inputs
```

---

## Presentation Preparation (Dami)

### Demo Script

1. **Introduction (2 minutes)**
   - Introduce team and project
   - Explain problem being solved

2. **Live Demo (8 minutes)**
   - Register new user
   - Search and add a friend
   - Accept friend request
   - Create an event and invite friend
   - Switch users, show RSVP
   - View dashboard with events

3. **Technical Overview (5 minutes)**
   - Show tech stack
   - Explain MERN architecture
   - Show database models
   - Highlight interesting code

4. **Q&A (5 minutes)**

### Presentation Slides Outline

1. Title slide
2. Team members and roles
3. Problem statement
4. Solution overview
5. Tech stack
6. Architecture diagram
7. Database schema
8. Key features
9. Live demo
10. Challenges faced
11. Lessons learned
12. Future enhancements
13. Thank you / Q&A

---

## Final Deployment (Optional)

### Deploy to Heroku + MongoDB Atlas

1. **Set up MongoDB Atlas**
   - Create free cluster
   - Get connection string
   - Update MONGODB_URI in production

2. **Deploy Backend to Heroku**
   ```bash
   cd backend
   heroku create your-app-name-backend
   heroku config:set MONGODB_URI="your-atlas-uri"
   heroku config:set JWT_SECRET="your-secret"
   git push heroku main
   ```

3. **Deploy Frontend to Vercel/Netlify**
   - Update API calls to point to Heroku backend
   - Deploy via GitHub integration

---

## Congratulations!

You've built a complete MERN stack application! 🎉
