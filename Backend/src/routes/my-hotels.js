const express = require('express')
const multer = require('multer')
const {v2} = require('cloudinary')
const Hotel = require('../models/hotel')
const verifyToken = require('../middleware/auth')
const {body} = require('express-validator')
const { verify } = require('jsonwebtoken')
const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024 //20Mb
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

        const imageUrls = await uploadImages(imageFiles)
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

router.get('/:id', verifyToken, async (req, res) => {
    const id = req.params.id.toString()

    try {
        const hotel = await Hotel.findOne({
            _id: id,
            userId: req.userId
        })
        res.json(hotel)
    } catch (e) {
        res.status(500).json({message: "Error fetching hotels"})
    }
})

router.put('/:hotelId', verifyToken, upload.array("imageFiles"), async (req, res) => {
    try {
        const updatedHotel = req.body
        updatedHotel.lastUpdated = new Date()

        const hotel = await Hotel.findOneAndUpdate({
            _id: req.params.hotelId,
            userId: req.userId
        }, updatedHotel, { new: true })

        if (!hotel) {
            return res.status(404).json({message: "Hotel not found"})
        }

        const files = req.files
        const updatedImageUrls = await uploadImages(files)
        hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])]
        await hotel.save()

        res.status(201).json(hotel)

    } catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
})

async function uploadImages(imageFiles) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64") //converting img to base 64 string
        let dataURI = "data:" + image.mimetype + ";base64," + b64
        const res = await v2.uploader.upload(dataURI)
        return res.url
    })

    const imageUrls = await Promise.all(uploadPromises)
    return imageUrls
}

module.exports = router
