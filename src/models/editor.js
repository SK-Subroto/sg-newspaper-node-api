const mongoose = require('mongoose')

const editorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    phone: {
        type: String,
        default: null,
        required: false
    },
    address: {
        type: String,
        default: null,
        required: false
    }
})

const Editor = mongoose.model('Editor', editorSchema)

module.exports = Editor