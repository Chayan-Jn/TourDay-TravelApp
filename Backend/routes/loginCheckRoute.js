const router = require('express').Router()
const {authMiddleware} = require('../middlewares/authMiddleware')
router.get('/login-check', authMiddleware, (req, res) => {
    res.status(200).json({
      success: true,
      user: req.userInfo,
      message: 'User is logged in'
    });
  });
  

module.exports = router;