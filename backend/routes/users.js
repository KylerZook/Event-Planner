import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/users/register - Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users/:id - Get user profile
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('friends', 'username email')
      .populate('pendingRequests', 'username email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/users/:id/update - Update user profile
router.put('/:id/update', authenticateToken, async (req, res) => {
  try {
    // TODO: Implement profile update logic
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users/:id/friend-request - Send friend request
router.post('/:id/friend-request', authenticateToken, async (req, res) => {
  try {
    // TODO: Implement friend request logic
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users/:id/accept-friend - Accept friend request
router.post('/:id/accept-friend', authenticateToken, async (req, res) => {
  try {
    // TODO: Implement accept friend logic
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users/:id/events - Get all events for a user
router.get('/:id/events', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'events',
      populate: { path: 'host', select: 'username' }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
