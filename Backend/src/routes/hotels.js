const {Router} = require('express')
const router = Router()
const Hotel = require('../models/hotel')
const {param, validationResult} = require('express-validator')
const Stripe = require('stripe')
const verifyToken = require('../middleware/auth')
const stripe = new Stripe(process.env.STRIPE_API_KEY)

router.get('/search', async (req, res) => {
    try {
        const query = constructSearchQuery(req.query)

        let sortOptions = {}
        switch(req.query.sortOption) {
            case "starRating":
                sortOptions = { starRating: -1 }
                break
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1 }
                break
            case "pricePerNightDsc":
                sortOptions = { pricePerNight: -1 }
                break
        }

        const pageSize = 5
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1")
        const skip = (pageNumber - 1) * pageSize 

        const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize)

        const total = await Hotel.countDocuments(query)

        const response = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total/pageSize)
            }
        }
        res.json(response)
    } catch (e) {
        console.log("Error: ", e)
        res.status(500).json({message: "Something went wrong"})
    }
})

router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find().sort("-lastUpdated")
    res.json(hotels)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Error fetching hotels" })
  }
})

router.get('/:id', [
    param("id").notEmpty().withMessage("Hotel ID is required")
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors })
    }

    const id = req.params.id.toString()

    try {
        const hotel = await Hotel.findById(id)
        res.json(hotel)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error fetching hotel" })
    }
})

router.post('/:hotelId/bookings/payment-intent', verifyToken, async (req, res) => {
  const { numberOfNights } = req.body
  const hotelId = req.params.hotelId

  const hotel = await Hotel.findById(hotelId)

  if (!hotel) {
    return res.status(400).json({ message: "Hotel not found" })
  }

  const totalCost = hotel.pricePerNight * numberOfNights

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCost * 100,
    currency: "USD",
    metadata: {
      hotelId,
      userId: req.userId
    }
  })

  if (!paymentIntent.client_secret) {
    return res.status(500).json({ message: "Error creating payment intent" })
  }

  const response = {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    totalCost
  }

  res.send(response)
})

router.post('/:hotelId/bookings', verifyToken, async (req, res) => {
  try {
    const paymentIntentId = req.body.paymentIntentId

    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId
    )

    if (!paymentIntent) {
      return res.status(400).json({message: "Payment intent not found" })
    }

    if (
      paymentIntent.metadata.userId !== req.userId ||
      paymentIntent.metadata.hotelId !== req.params.hotelId
    ) {
      return res.status(400).json({message: "Payment intent mismatch"})
    }

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({message: `Payment intent not succeeded. Status: ${paymentIntent.status}`})
    }

    const newBooking = {
      ...req.body,
      userId: req.userId
    }

    const hotel = await Hotel.findOneAndUpdate({_id: req.params.hotelId}, {
      $push: { bookings: newBooking }
    })

    if (!hotel) {
      return res.status(400).json({message: "Hotel not found"})
    }

    await hotel.save()
    res.status(200).send()

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Something went wrong" })
  } 
})

const constructSearchQuery = (queryParams) => {
    let constructedQuery = {}
  
    if (queryParams.destination) {
      constructedQuery.$or = [
        { city: new RegExp(queryParams.destination, "i") },
        { country: new RegExp(queryParams.destination, "i") },
      ]
    }
  
    if (queryParams.adultCount) {
      constructedQuery.adultCount = {
        $gte: parseInt(queryParams.adultCount),
      }
    }
  
    if (queryParams.childCount) {
      constructedQuery.childCount = {
        $gte: parseInt(queryParams.childCount),
      }
    }
  
    if (queryParams.facilities) {
      constructedQuery.facilities = {
        $all: Array.isArray(queryParams.facilities)
          ? queryParams.facilities
          : [queryParams.facilities],
      }
    }
  
    if (queryParams.types) {
      constructedQuery.type = {
        $in: Array.isArray(queryParams.types)
          ? queryParams.types
          : [queryParams.types],
      }
    }
  
    if (queryParams.stars) {
      const starRatings = Array.isArray(queryParams.stars)
        ? queryParams.stars.map((star) => parseInt(star))
        : parseInt(queryParams.stars)
  
      constructedQuery.starRating = { $in: starRatings };
    }
  
    if (queryParams.maxPrice) {
      constructedQuery.pricePerNight = {
        $lte: parseInt(queryParams.maxPrice).toString(),
      }
    }
  
    return constructedQuery
}

module.exports = router