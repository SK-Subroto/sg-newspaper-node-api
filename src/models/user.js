const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Editor = require('./editor')
const Admin = require('./admin')



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }],
}, {
    timestamps: true
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentails = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('unable to login')
    }

    return user
}

// create editor
userSchema.methods.createEditor = async function () {
    const user = this

    const newEditor = new Editor({
        user: user._id   // assign the _id from the person
    });

    await newEditor.save();

}

// delete editor
userSchema.methods.deleteEditor = async function () {
    const user = this

    const editor = await Editor.findById({ _id: user._id })

    if (editor) {
        editor.remove()
    }

}

// create admin
userSchema.methods.createAdmin = async function () {
    const user = this

    const newAdmin = new Admin({
        user: user._id   // assign the _id from the person
    });

    await newAdmin.save();

}

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// remove Editor
userSchema.methods.deleteEditor = async function () {
    const user = this
    await Editor.findOneAndDelete({ user: user._id })
}

const User = mongoose.model('User', userSchema)

module.exports = User