const adminMiddleware = require('../middlewares/adminMiddleware')
const { authMiddleware } = require('../middlewares/authMiddleware')
const router = require('express').Router();

router.get('/admin/admin-check', authMiddleware, adminMiddleware, (req, res) => {
  console.log('Inside admin check \n user is ', req.userInfo)
  res.status(200).json({
    success: true,
    message: 'Admin verified',
    user: req.userInfo
  });
});

module.exports = router;