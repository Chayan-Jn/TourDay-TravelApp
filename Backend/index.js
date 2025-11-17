const express = require('express')
const connectToDb = require('./config/db')
const cookieParser = require('cookie-parser');
const cors = require('cors')

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes')
const loginCheckRoute = require('./routes/loginCheckRoute')
const tripRoutes = require('./routes/tripRoutes');

const app = express()
const allowedOrigins = [
    'http://localhost:5173',
    'https://rkl6rjdf-5173.inc1.devtunnels.ms'
]

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true) // allow non-browser requests like Postman
        if (allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))
app.use(express.json())
app.use(cookieParser());


app.use(authRoutes);
app.use(adminRoutes);
app.use(loginCheckRoute);
app.use(tripRoutes);

app.get('/test', (req, res) => {
    console.log('Test endpoint hit');
    res.send('ok');
});


console.log("hi")
connectToDb()

app.listen(3000, () => {
    console.log("Server listening on port 3k")
})