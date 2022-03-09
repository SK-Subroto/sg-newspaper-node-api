const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    phone: {
        type: String,
        default: null,
        required: false
    }
})

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin