const express = require('express');
const { sendWelcomeEmail } = require('../emails/account');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const router = new express.Router()

const User = require('../models/user')


// user registration Api
router.post('/users/registration', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, req.body.password, user.name)
        const token = await user.generateAuthToken();
        await user.createEditor();
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// user login api
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentails(req.body.email, req.body.password)
        if (!user.isActive) {
            throw new Error()
        }
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send("wrong credential or your account is not active yet")
    }
})

// user logout api
router.post('/users/logout/', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send("logout successfully")
    } catch (e) {
        res.status(500).send()
    }
})

// user logout all api
router.post('/users/logout-all', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send("Successfully logout from all devices")
    } catch (e) {
        res.status(500).send()
    }
})


// all users
router.get('/users', admin, async (req, res) => {
    try {
        const data = await User.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// single user
router.get('/users/:id', admin, async (req, res) => {
    const _id = req.params.id
    try {
        const data = await User.findById({ _id });
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
module.exports = router;