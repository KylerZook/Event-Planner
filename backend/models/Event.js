import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rsvpStatus: {
      type: String,
      enum: ['Pending', 'Attending', 'Not Attending'],
      default: 'Pending'
    }
  }]
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
