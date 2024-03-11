const express = require('express')
const verifyToken = require('../middleware/auth')
const Hotel = require('../models/hotel')

const router = express.Router()

router.get('/', verifyToken, async (req, res) => {
    try {
        const hotels = await Hotel.find({
            bookings: { $elemMatch: { userId: req.userId } }
        })

        const results = hotels.map((hotel) => {
            const userBookings = hotel.bookings.filter((booking) => {
                return booking.userId === req.userId
            })

            const hotelWithUserBookings = {
                ...hotel.toObject(),
                bookings: userBookings
            } 

            return hotelWithUserBookings
        })

        res.status(200).send(results)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Unable to find Bookings" })
    }
})

module.exports = router