const express = require('express')
const multer = require('multer')
const {v2} = require('cloudinary')
const Hotel = require('../models/hotel')
const verifyToken = require('../middleware/auth')
const {body} = require('express-validator')
const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024 //5Mb
    }
})

router.post("/", verifyToken, [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Type is required"),
    body("pricePerNight").notEmpty().isNumeric().withMessage("Price per night must be a number and is required"),
    body("facilities").notEmpty().isArray().withMessage("Facilities are required"),
], upload.array("imageFiles", 6), async (req, res) => {
    try {
        const imageFiles = req.files
        const newHotel = req.body

        const uploadPromises = imageFiles.map(async (image) => {
            const b64 = Buffer.from(image.buffer).toString("base64") //converting img to base 64 string
            let dataURI = "data:" + image.mimetype + ";base64," + b64
            const res = await v2.uploader.upload(dataURI)
            return res.url
        })

        const imageUrls = await Promise.all(uploadPromises)
        newHotel.imageUrls = imageUrls
        newHotel.lastUpdated = new Date()
        newHotel.userId = req.userId

        const hotel = new Hotel(newHotel)
        await hotel.save()

        res.status(201).send(hotel)
    } catch (e) {
        console.log("Errror creating hotel: ", e)
        res.status(500).json({ message: "Something went wrong"})
    }
})

router.get('/', verifyToken, async (req, res) => {
    try {
        const hotels = await Hotel.find({userId: req.userId})
        res.json(hotels)
    } catch (e) {
        res.status(500).json({ message: "Error fetching hotels" })
    }
})

module.exports = router