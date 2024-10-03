const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    FullName: String,
    maxActions: {
        type: Number,
        default: 7
    }
}, {versionKey: false})

module.exports = mongoose.model('User', userSchema)