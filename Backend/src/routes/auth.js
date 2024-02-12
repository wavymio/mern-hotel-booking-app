const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/user')
const verifyToken = require('../middleware/auth')

router.post('/login', [
    check("email", "Email is required").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()})
    }

    const {email, password} = req.body

    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({message: "Invalid Credentials"})
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({message: "Invalid Credentials"})
        }

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY, {expiresIn: "1d"})
        res.cookie("auth_token", token, {
            maxAge: 86400000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        })
        res.status(200).json({userId: user.id})
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: "Something went wrong"})
    }
})

router.get('/validate-token', verifyToken, (req, res) => {
    res.status(200).send({userId: req.userId})
})


router.post('/logout', (req, res) => {
    res.cookie("auth_token", "", {
        expires: new Date(0)
    })
    res.send()
})
module.exports = router