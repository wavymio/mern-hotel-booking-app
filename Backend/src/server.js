const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv/config')
const path = require('path')
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
// Routes
const userRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')

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

app.listen(8080, () => {
    console.log("Server is running on localhost:8080")
})