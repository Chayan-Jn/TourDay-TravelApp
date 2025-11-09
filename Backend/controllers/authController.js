const bcrypt = require('bcryptjs');
const User = require('../model/User')

async function register(req, res) {
    const { username, password } = req.body;
    
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
            password: hashedPassword
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

module.exports = { register };