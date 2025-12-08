# Event Planner: The Social Party Planner

A MERN stack application for planning parties and social gatherings with friends.

## Team Members

- **Kyler & Paddy**: Lead Frontend Developers (Authentication & Profile UI, State Management)
- **Christian**: Full-Stack Developer (Express API Routes, Axios integration, Database)
- **Sydney**: Database & Event Specialist (MongoDB Schema Design, CRUD, RSVP system)
- **Dami**: Frontend/UX Designer & Documentation Lead (Forms & Dashboard UI, Styling, Documentation)

## Project Overview

Event Planner makes it super easy to plan parties and social gatherings with friends. Users can:
- Create and manage their profile
- Build a friends list
- Create events and invite friends
- RSVP to events
- View all their events in one personalized dashboard

## Tech Stack

- **Frontend**: React 18 + Vite + React Router
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **HTTP Client**: Axios
- **Authentication**: JWT (JSON Web Tokens)

---

## Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (running locally on port 27017, or use MongoDB Atlas)

### Installation

1. **Clone/Navigate to the project directory**
   ```bash
   cd "Final Project"
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env and update values if needed
   ```

3. **Set up Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB:
   mongod

   # Or use MongoDB Atlas by updating MONGODB_URI in backend/.env
   ```

5. **Run the Application**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

---

## Application Structure

### Routes & Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with login/signup links |
| `/login` | Login | User login form |
| `/register` | Register | User registration form |
| `/dashboard` | Dashboard | Main feed showing all events |
| `/profile/:id` | Profile | User profile with friends list |
| `/event/create` | EventForm | Create new event form |
| `/event/:id` | EventDetails | Event details with RSVP and attendee list |

### API Endpoints

#### User Routes (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/:id` | Get user profile | Yes |
| PUT | `/:id/update` | Update user profile | Yes |
| POST | `/:id/friend-request` | Send friend request | Yes |
| POST | `/:id/accept-friend` | Accept friend request | Yes |
| GET | `/:id/events` | Get all user's events | Yes |

#### Event Routes (`/api/events`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create new event | Yes |
| GET | `/:id` | Get event details | Yes |
| PUT | `/:id/rsvp` | Update RSVP status | Yes |
| DELETE | `/:id` | Delete event (host only) | Yes |

### Database Models

#### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  friends: [ObjectId] (references User),
  pendingRequests: [ObjectId] (references User),
  events: [ObjectId] (references Event),
  timestamps: true
}
```

#### Event Model
```javascript
{
  title: String (required),
  host: ObjectId (required, references User),
  date: Date (required),
  location: String (required),
  description: String,
  attendees: [{
    user: ObjectId (references User),
    rsvpStatus: String (enum: 'Pending', 'Attending', 'Not Attending')
  }],
  timestamps: true
}
```

---

## Implementation Timeline

### Phase 1: Foundation ✅ COMPLETE

**Deliverables:**
- [x] MongoDB/Express connection established
- [x] User Model created
- [x] Authentication (register/login) implemented
- [x] Initial React components created
- [x] Routing set up

**Implementation Steps:**

1. **Backend Setup**
   - [x] Create `backend/config/db.js` for MongoDB connection
   - [x] Create `backend/models/User.js` with schema
   - [x] Create `backend/middleware/auth.js` for JWT verification
   - [x] Create `backend/routes/users.js` with register/login routes
   - [x] Set up `backend/server.js` with Express and middleware

2. **Frontend Setup**
   - [x] Create `frontend/src/App.jsx` with React Router
   - [x] Create `Home.jsx`, `Login.jsx`, `Register.jsx` components
   - [x] Implement authentication state management
   - [x] Set up Axios for API calls

3. **Testing Phase 1**
   - [ ] Test user registration
   - [ ] Test user login
   - [ ] Verify JWT token generation
   - [ ] Test protected routes

### Phase 2: Core Features (IN PROGRESS)

**Deliverables:**
- [ ] Event Model complete
- [ ] Event CRUD operations working
- [ ] Event creation/viewing functional on frontend
- [ ] Basic friend management implemented

**Implementation Steps:**

1. **Event Backend** (Assigned: Christian, Sydney)
   - [x] Create `backend/models/Event.js` with schema
   - [x] Create `backend/routes/events.js` with CRUD endpoints
   - [ ] Test event creation with Postman
   - [ ] Test event retrieval
   - [ ] Test RSVP updates
   - [ ] Test event deletion

2. **Event Frontend** (Assigned: Kyler, Paddy)
   - [x] Create `Dashboard.jsx` to display events
   - [x] Create `EventForm.jsx` for event creation
   - [x] Create `EventDetails.jsx` for event viewing
   - [ ] Implement friend selection in EventForm
   - [ ] Test event creation flow
   - [ ] Test event viewing
   - [ ] Test RSVP functionality

3. **Friend Management - Backend** (Assigned: Christian, Sydney)
   - [ ] Implement `/api/users/:id/friend-request` endpoint
   - [ ] Implement `/api/users/:id/accept-friend` endpoint
   - [ ] Add friend search functionality
   - [ ] Test friend request flow

4. **Friend Management - Frontend** (Assigned: Kyler, Paddy)
   - [ ] Create `FriendList.jsx` component
   - [ ] Create `FriendSearch.jsx` component
   - [ ] Update `Profile.jsx` to show friends and pending requests
   - [ ] Implement friend request sending
   - [ ] Implement friend request acceptance

**Testing Phase 2:**
- [ ] Create test events with invited friends
- [ ] Verify events appear on dashboard
- [ ] Test RSVP status changes
- [ ] Test friend request workflow
- [ ] Verify data persistence in MongoDB

### Phase 3: Polish and Presentation (PENDING)

**Deliverables:**
- [ ] Complete RSVP logic
- [ ] Friend request system fully functional
- [ ] Application styling and responsive design
- [ ] Documentation and presentation materials

**Implementation Steps:**

1. **Complete RSVP System** (Assigned: Sydney)
   - [ ] Add RSVP notifications
   - [ ] Show attendee counts on dashboard
   - [ ] Filter events by RSVP status
   - [ ] Add RSVP deadline functionality (optional)

2. **Complete Friend System** (Assigned: Christian)
   - [ ] Add "Remove Friend" functionality
   - [ ] Add "Decline Friend Request" functionality
   - [ ] Implement friend search with filters
   - [ ] Add friend suggestions (optional)

3. **Styling & UX** (Assigned: Dami)
   - [ ] Design color scheme and theme
   - [ ] Style all pages with CSS/Tailwind
   - [ ] Make responsive for mobile devices
   - [ ] Add loading states
   - [ ] Add error handling UI
   - [ ] Add success notifications

4. **Additional Features** (Assigned: Kyler, Paddy)
   - [ ] Create `RSVPButton.jsx` component
   - [ ] Create `AttendeeList.jsx` component
   - [ ] Add profile picture support (optional)
   - [ ] Add event editing functionality (optional)
   - [ ] Add event categories (optional)

5. **Documentation & Presentation** (Assigned: Dami)
   - [ ] Complete README with screenshots
   - [ ] Create API documentation
   - [ ] Prepare demo script
   - [ ] Create presentation slides
   - [ ] Record demo video (optional)

**Testing Phase 3:**
- [ ] Full end-to-end testing
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing
- [ ] Load testing with multiple users
- [ ] Security testing (SQL injection, XSS)

---

## Development Guidelines

### Git Workflow

1. **Create feature branches:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Commit frequently with clear messages:**
   ```bash
   git add .
   git commit -m "Add user registration endpoint"
   ```

3. **Push to remote:**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request and get team review**

### Code Style

- Use **ES6+ syntax** (const/let, arrow functions, async/await)
- Use **meaningful variable names**
- Add **comments** for complex logic
- Keep **functions small and focused**
- Use **try-catch** for error handling
- Validate **user input** on both frontend and backend

### Testing Tips

**Backend Testing with Postman/curl:**
```bash
# Register user
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get user profile (use token from login response)
curl http://localhost:5000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Common Issues & Solutions

### MongoDB Connection Issues
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running:
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas and update MONGODB_URI in .env
```

### CORS Errors
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:** Already configured in `backend/server.js` with `cors()` middleware.

### JWT Authentication Errors
```
Error: Invalid token
```
**Solution:**
- Check that token is being sent in Authorization header
- Verify JWT_SECRET matches in .env
- Check token hasn't expired (7 day expiration)

### Vite Proxy Not Working
```
Error: Failed to fetch from /api/*
```
**Solution:** Check `frontend/vite.config.js` proxy settings and ensure backend is running.

---

## Additional Resources

### MERN Stack Documentation
- [React Docs](https://react.dev/)
- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [Axios Docs](https://axios-http.com/docs/intro)

### Tutorials
- [JWT Authentication](https://www.youtube.com/watch?v=mbsmsi7l3r4)
- [React Router](https://reactrouter.com/en/main/start/tutorial)
- [MongoDB CRUD Operations](https://www.mongodb.com/docs/manual/crud/)

---

## Project Checklist

### Before Starting
- [ ] All team members have Node.js installed
- [ ] MongoDB installed or Atlas account created
- [ ] Git repository set up
- [ ] Team roles assigned

### Phase 1 Checklist
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] MongoDB connection working
- [ ] User registration working
- [ ] User login working
- [ ] JWT authentication working

### Phase 2 Checklist
- [ ] Event creation working
- [ ] Event viewing working
- [ ] Event deletion working
- [ ] RSVP functionality working
- [ ] Dashboard displays events
- [ ] Friend requests working

### Phase 3 Checklist
- [ ] All features complete
- [ ] Application styled
- [ ] Mobile responsive
- [ ] Documentation complete
- [ ] Presentation ready

---

## License

This is a student project for CS2830 - Web Programming at University of Missouri.

---

## Contact

For questions or issues, contact the team members through the course communication channels.
