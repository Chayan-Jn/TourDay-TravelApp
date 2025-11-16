const bcrypt = require('bcryptjs');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function register(req, res) {
    console.log('register runs')
    const { username, password,role } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            password: hashedPassword,
            role:role || 'user'
        });

        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                username: user.username
            },
            message:"User registered successfully"
        });
    } catch (err) {
        console.error('Error while registering', err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

async function login(req,res) {
    console.log("inside login controller")
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }

        const hashedPassword = existingUser.password;
        const isPasswordCorrect = await bcrypt.compare(password,hashedPassword);
        
        if(!isPasswordCorrect){
            return res.status(400).json({
                success:false,
                message:"Invalid Credentials"
            })
        }
        const token = jwt.sign(
            { id: existingUser._id, username: existingUser.username, role: existingUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          )
          

        // in localhost secure should be false, because it uses http not https
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('token',token,{
            httpOnly:true,
            secure:false,
            sameSite: 'lax',
            maxAge:3600000 //1h
        });
        return res.status(200).json({
            success:true,
            message:"Logged in successfully"
        })

    } catch (err) {
        console.error('Error while registering', err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }


}

module.exports = { register,login };