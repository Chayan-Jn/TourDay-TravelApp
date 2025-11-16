const jwt = require('jsonwebtoken');
require('dotenv').config()
async function authMiddleware(req,res,next) {
    try{
        console.log('🔍 Auth middleware hit!'); this
        console.log('Cookies: ', req.cookies); 
        const token = req.cookies?.token;
        if(!token){
            return res.status(400).json({
                success:false,
                message:"No token found. Please log in again"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userInfo = decoded;
        next()
    }
    catch (err) {
        console.error('Auth err', err.message);
        res.status(403).json({
          success: false,
          message: "Invalid or expired token",
        });
      }
}

module.exports = {authMiddleware}