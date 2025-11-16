const router = require('express').Router()
const {authMiddleware} = require('../middlewares/authMiddleware')
router.get('/login-check', authMiddleware, (req, res) => {
  console.log('in login check')
    res.status(200).json({
      success: true,
      user: req.userInfo,
      message: 'User is logged in'
    });
  });
  

module.exports = router;