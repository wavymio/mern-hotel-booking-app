const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv/config')
const path = require('path')
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
const {v2} = require('cloudinary')
v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Routes
const userRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')
const myHotelRoutes = require('./routes/my-hotels')
const hotelRoutes = require('./routes/hotels')
const bookingRoutes = require('./routes/my-bookings')

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.static(path.join(__dirname, "../../Frontend/dist")))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/my-hotels', myHotelRoutes)
app.use('/api/hotels', hotelRoutes)
app.use('/api/my-bookings', bookingRoutes)

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"))
})

app.listen(8080, () => {
    console.log("Server is running on localhost:8080")
})