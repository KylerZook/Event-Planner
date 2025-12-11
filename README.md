# Event Planner: The Social Party Planner
## Youtube Link: https://youtu.be/o2SsD6Tzscs?si=fYwyMM-JwCLIhXAc
A MERN stack application for planning parties and social gatherings with friends.

### Prerequisites
- **Node.js** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **No MongoDB installation required!** (Uses cloud database)

### Installation & Setup (5 minutes)

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

3. **Database Configuration**
   - The `.env` file is already configured with MongoDB Atlas (cloud database)
   - No additional setup needed!

4. **Start the Application**

   **Terminal 1 - Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   Expected output:
   ```
   Server is running on port 5001
   MongoDB Connected: ac-amjv27z-shard-00-00.krjcd7n.mongodb.net
   ```

   **Terminal 2 - Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

   Expected output:
   ```
   ➜ Local: http://localhost:3000/
   ```

5. **Open the Application**
   - Navigate to: **http://localhost:3000**
   - Sign up to create an account
   - Start using the app!

### App Functionalities

1. **Register** a new account (username, email, password)
2. Click **"Find Friends"** → Search for another user (or create a second account in incognito window)
3. Send a **friend request**
4. Go to **"My Profile"** → Accept the friend request
5. Click **"Create Event"** → Fill in details and invite your friend
6. View **event details** and RSVP

### Troubleshooting

**Port 5001 already in use:**
```bash
lsof -ti:5001 | xargs kill -9
```

**Port 3000 already in use:**
- Vite will automatically suggest an alternative port

---

## Project Overview

### Team Members

- **Kyler Zook & Patrick Garcia**: Lead Frontend Developers (Authentication & Profile UI, State Management)
- **Christian Streby**: Full-Stack Developer (Express API Routes, Axios integration, Database)
- **Sydney Bair**: Database & Event Specialist (MongoDB Schema Design, CRUD, RSVP system)
- **Dami Adepoju**: Frontend/UX Designer & Documentation Lead (Forms & Dashboard UI, Styling, Documentation)

### Features Implemented

- **User Authentication** - Register, login with JWT tokens
- **Friend System** - Search users, send/accept friend requests
- **Event Management** - Create events with title, date, location, description
- **Friend Invitations** - Invite friends from your friends list to events
- **RSVP System** - Attend, decline, or mark as pending
- **Dashboard** - View all your events (hosting and invited)
- **Navigation** - Seamless navigation between all pages
- **UI** - Clean black & white interface

### Tech Stack

- **Frontend**: React 18 + Vite + React Router
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas (Cloud)
- **HTTP Client**: Axios
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Custom CSS (Monochrome design)

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

## License

This is a student project for CS2830 - Web Programming at University of Missouri.

---

## Contact

For questions or issues, contact the team members through the course communication channels.
