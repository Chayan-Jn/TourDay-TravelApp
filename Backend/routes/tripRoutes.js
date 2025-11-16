const router = require('express').Router();
const adminMiddleware = require('../middlewares/adminMiddleware')
const { authMiddleware } = require('../middlewares/authMiddleware')
const { addTrip } = require('../controllers/tripUploadController');

router.post('/add-trips', authMiddleware, adminMiddleware, addTrip);

module.exports = router;