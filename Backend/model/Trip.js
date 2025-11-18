const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  destination: {
    type: String,
    required: true
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  durationDays: {
    type: Number,
    default: function () {
      if (this.startDate && this.endDate) {
        return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24))
      }
      return 0
    }
  },

  pricePerPerson: {
    type: Number,
    required: true
  },

  maxGroupSize: {
    type: Number,
    required: true
  },

  availableSeats: {
    type: Number,
    required: true
  },

  itinerary: [
    {
      day: Number,
      activities: [String]
    }
  ],

  hotels: [
    {
      name: String,
      link: String
    }
  ],
  

  included: [String],

  excluded: [String],

  images: [String],

  guide: {
    name: String,
    contact: String
  },

  category: {
    type: String,
    default: 'Other'
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Trip', tripSchema)
