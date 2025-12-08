import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <h1>Event Planner</h1>
      <p>The Social Party Planning App</p>
      <p>Plan parties and social gatherings with friends, all in one place!</p>

      <div className="auth-buttons">
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Sign Up</button>
        </Link>
      </div>

      <div className="features">
        <h2>Features</h2>
        <ul>
          <li>Create and manage your profile</li>
          <li>Connect with friends</li>
          <li>Create events and send invitations</li>
          <li>RSVP to events</li>
          <li>View your personalized event dashboard</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
