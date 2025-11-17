const router = require('express').Router();
const adminMiddleware = require('../middlewares/adminMiddleware')
const { authMiddleware } = require('../middlewares/authMiddleware')

const { addTrip } = require('../controllers/tripUploadController');
const { bookTrip, getTripData,getAllTrips } = require('../controllers/tripController')
const { getUserBookings } = require('../controllers/getUserBookingsController')

router.post('/add-trips', authMiddleware, adminMiddleware, addTrip);
router.post('/book-trip', authMiddleware, bookTrip);
router.post('/get-trip-data', authMiddleware, getTripData)
router.get('/get-all-trips',authMiddleware,getAllTrips)

router.get('/get-user-bookings', authMiddleware, getUserBookings)

module.exports = router;