const express = require('express');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const router = new express.Router()

const Editor = require('../models/editor')


//Get all Editor
router.get('/editors', admin, async (req, res) => {
    try {
        const data = await Editor.find().populate({ path: "user", model: "User" });
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// single editor api 
router.get('/editors/:id', admin, async (req, res) => {
    const _id = req.params.id

    try {
        // const article = await Article.findOne({ _id, owner: req.user._id })
        const editors = await Editor.findOne({ _id }).populate({ path: "user", model: "User" });
        if (!editors) {
            return res.status(404).send()
        }
        res.send(editors)
    } catch (e) {
        res.status(500).send()
    }
})

// editor profile view
router.get('/editor-profile/me', auth, async (req, res) => {
    try {
        const editor = await Editor.findOne({ user: req.user._id }).populate({ path: "user", model: "User", select: '-isActive -isAdmin' });
        if (!editor) {
            throw new Error()
        }
        res.send(editor)
    } catch (e) {
        res.status(404).send("Editor profile not found")
    }
})

//Update Profile
router.patch('/editor-profile/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['phone', 'address']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'invalide update!' })
    }
    try {
        const editor = await Editor.findOne({ user: req.user._id }).populate({ path: "user", model: "User", select: '-isActive -isAdmin' });
        updates.forEach((update) => editor[update] = req.body[update])
        await editor.save()

        res.send(editor)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router;