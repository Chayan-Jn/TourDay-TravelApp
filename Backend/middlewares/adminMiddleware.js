function adminMiddleware(req, res, next) {
    console.log("inside admin middleware req.userInfo is ",req.userInfo);
    if (!req.userInfo || req.userInfo.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied - Admins only'
      })
    }
    next()
  }

module.exports = adminMiddleware;