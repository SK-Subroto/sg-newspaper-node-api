const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    const errorMessage = {};
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            errorMessage['error'] = "Please authentication";
            throw new Error()
        }
        else if (!user.isActive) {
            errorMessage['error'] = "Your accont is not active yet!!";
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send(errorMessage)
    }
}

module.exports = auth