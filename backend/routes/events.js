import express from 'express';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/events - Create new event
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, date, location, description, invitedFriends } = req.body;

    // Create event
    const event = new Event({
      title,
      host: req.user.id,
      date,
      location,
      description,
      attendees: invitedFriends.map(friendId => ({
        user: friendId,
        rsvpStatus: 'Pending'
      }))
    });

    await event.save();

    // Add event to host's events
    await User.findByIdAndUpdate(req.user.id, {
      $push: { events: event._id }
    });

    // Add event to all invited friends' events
    await User.updateMany(
      { _id: { $in: invitedFriends } },
      { $push: { events: event._id } }
    );

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/events/:id - Get event details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('host', 'username email')
      .populate('attendees.user', 'username email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/events/:id/rsvp - Update RSVP status
router.put('/:id/rsvp', authenticateToken, async (req, res) => {
  try {
    const { rsvpStatus } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Find and update the attendee's RSVP status
    const attendee = event.attendees.find(
      a => a.user.toString() === req.user.id
    );

    if (!attendee) {
      return res.status(403).json({ message: 'You are not invited to this event' });
    }

    attendee.rsvpStatus = rsvpStatus;
    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/events/:id - Delete event (host only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the host
    if (event.host.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the host can delete this event' });
    }

    // Remove event from all users' events arrays
    const allUserIds = [event.host, ...event.attendees.map(a => a.user)];
    await User.updateMany(
      { _id: { $in: allUserIds } },
      { $pull: { events: event._id } }
    );

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
