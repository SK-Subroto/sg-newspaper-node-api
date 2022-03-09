const mongoose = require('mongoose')
const validator = require('validator')

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        default: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Editor'
    },
    image: {
        type: Buffer
    }
}, {
    timestamps: true
})

articleSchema.methods.toJSON = function () {
    const article = this
    const articleObject = article.toObject()

    delete articleObject.image

    return articleObject
}

const Article = mongoose.model('Article', articleSchema)

module.exports = Article