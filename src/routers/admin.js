const express = require('express')
const { use } = require('express/lib/router')
const { sendActivationEmail } = require('../emails/account')
const admin = require('../middleware/admin')
const auth = require('../middleware/auth')
const router = new express.Router()

const Admin = require('../models/admin')
const Editor = require('../models/editor')
const User = require('../models/user')

// update user by id (admin)
router.patch('/users/:id', admin, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'invalide update!' })
    }
    try {
        const user = await User.findById(req.params.id)

        updates.forEach((update) => user[update] = req.body[update])

        await user.save()

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// delete user by id (admin)
router.delete('/users/:id', admin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        await user.deleteEditor();

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

// active user by id (admin)
router.patch('/active-user/:id', admin, async (req, res) => {
    const _id = req.params.id;
    const updateDoc = {
        $set: {
            isActive: false
        },
    }

    try {
        await User.updateMany({ isAdmin: false }, updateDoc);
        const user = await User.findById({ _id })
        user.isActive = true;
        user.save();
        sendActivationEmail(user.email, user.name)
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// make admin by id (admin)
router.patch('/make-admin/:id', admin, async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById({ _id })
        user.isAdmin = true;
        user.save();
        await user.deleteEditor();
        await user.createAdmin();
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }

})

// admin profile view
router.get('/admin-profile/me', admin, async (req, res) => {
    try {
        const admin = await Admin.findOne({ user: req.user._id }).populate({ path: "user", model: "User" });
        res.send(admin)
    } catch (e) {
        res.status(500).send()
    }
})

// update admin profile
router.patch('/admin-profile/me', admin, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['phone']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'invalide update!' })
    }
    try {
        const admin = await Admin.findOne({ user: req.user._id })

        updates.forEach((update) => admin[update] = req.body[update])

        await admin.save()
        res.send(admin)
    } catch (e) {
        res.status(400).send(e)
    }
})

// search user
router.get('/search-editor/:email', admin, async (req, res) => {
    const email = req.params.email;

    try {
        const editor = await Editor.findOne().populate({ path: "user", match: { email } });
        res.send(editor)
    } catch (e) {
        res.status(400).send(e)
    }
})


module.exports = router