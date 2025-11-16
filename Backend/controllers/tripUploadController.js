const Trip = require('../model/Trip')

async function addTrip(req, res) {
  try {
    const {
      title,
      description,
      destination,
      startDate,
      endDate,
      pricePerPerson,
      maxGroupSize,
      availableSeats,
      category,
      included,
      excluded,
      images,
      guide,
      itinerary
    } = req.body

    if (!title || !description || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

    const trip = new Trip({
      title,
      description,
      destination,
      startDate,
      endDate,
      pricePerPerson,
      maxGroupSize,
      availableSeats,
      category,
      included,
      excluded,
      images,
      guide,
      itinerary
    })

    await trip.save()

    res.status(201).json({
      success: true,
      message: 'Trip added successfully',
      trip
    })
  } catch (err) {
    console.error('Error adding trip', err)
    res.status(500).json({
      success: false,
      message: 'Server error while creating trip'
    })
  }
}

module.exports = { addTrip }
