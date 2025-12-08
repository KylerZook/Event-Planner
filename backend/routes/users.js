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

// GET /api/users/search - Search for users
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || query.trim().length === 0) {
      return res.json([]);
    }

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
    const targetUserId = req.params.id;
    const requesterId = req.user.id;

    // Can't send request to yourself
    if (targetUserId === requesterId) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    // Check if already friends
    const requester = await User.findById(requesterId);
    if (requester.friends.includes(targetUserId)) {
      return res.status(400).json({ message: 'Already friends with this user' });
    }

    // Check if request already sent
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

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
