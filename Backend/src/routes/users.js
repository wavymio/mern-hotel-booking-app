const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const {validationResult, check} = require('express-validator')

router.post('/register', [
    check('firstName', 'First name is required').isString(),
    check('lastName', 'Last name is required').isString(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() })
    }
    try {
        let user = await User.findOne({
            email: req.body.email
        })

        if (user) {
            return res.status(400).json({message: 'User already exists'})
        }

        user = new User(req.body)
        await user.save()

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d"
        })

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000
        })

        return res.status(200).json({message: "User registered successfully"})
    } catch (err) {
        console.log(err)
        res.status(500).send({message: "Something went wrong"})
    }
})

module.exports = router