const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

const Article = require('../models/article')
// const multer = require('multer')
const sharp = require('sharp')
const upload = require('../middleware/upload')
const Editor = require('../models/editor')


//Get all article
router.get('/articles', auth, async (req, res) => {
    try {
        const data = await Article.find().populate({
            path: "owner",
            populate: {
                path: 'user',
                select: '-_id -password -isAdmin -isActive -tokens -createdAt -createdAt -__v'
            },
            select: '-phone -address -__v'
        });
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// article Post Api
// router.post('/articles', auth, async (req, res) => {
//     // const article = new Article(req.body)
//     try {
//         const editor = await Editor.findOne({ owner: req.user._id });

//         const article = new Article({
//             ...req.body,
//             owner: editor._id
//         })

//         await article.save()
//         res.status(201).send(article)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

// single article api 
router.get('/articles/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        // const article = await Article.findOne({ _id, owner: req.user._id })
        const article = await Article.findOne({ _id })
        if (!article) {
            return res.status(404).send()
        }
        res.send(article)
    } catch (e) {
        res.status(500).send()
    }
})

// update article without image
router.patch('/articles/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalide updates!' })
    }
    try {
        const article = await Article.findOne({ _id: req.params.id })
        // const article = await Article.findOne({ _id: req.params.id, owner: req.user._id })

        if (!article) {
            return res.status(404).send()
        }

        updates.forEach((update) => article[update] = req.body[update])
        await article.save()

        res.send(article)
    } catch (e) {
        res.status(400).send(e)
    }
})

//delete article api
router.delete('/articles/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findOne({ _id:req.params.id, owner: req.user._id })
        const article = await Article.findOneAndDelete({ _id: req.params.id })
        // const article = await Article.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!article) {
            return res.status(404).send()
        }

        // task.remove()

        res.send(article)
    } catch (e) {
        res.status(500).send()
    }
})

// image 

// post article api
router.post('/articles', [auth, upload.single('image')], async (req, res) => {
    const article = new Article(req.body)

    const buffer = await sharp(req.file.buffer).resize({ width: 400, height: 250 }).png().toBuffer()

    try {
        const editor = await Editor.findOne({ owner: req.user._id });
        article['owner'] = editor._id;
        article['image'] = buffer;
        await article.save();
        res.send({ title: article.title })
    } catch {
        res.status(400).send(e)
    }
})

// update article image api
router.patch('/articles/:id/image', [auth, upload.single('image')], async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 400, height: 250 }).png().toBuffer()
    const _id = req.params.id

    try {
        const article = await Article.findOne({ _id })
        article['image'] = buffer
        if (!article) {
            return res.status(404).send()
        }
        await article.save()
        res.send(article)
    } catch (e) {
        res.status(500).send()
    }
})



// article image delete
router.delete('/articles/:id/image', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const article = await Article.findOne({ _id })
        article['image'] = undefined
        if (!article) {
            return res.status(404).send()
        }
        await article.save()
        res.send(article)
    } catch (e) {
        res.status(500).send()
    }
})

// article image
router.get('/articles/:id/image', auth, async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)

        if (!article || !article.image) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(article.image)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router;