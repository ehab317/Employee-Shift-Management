const mongoose = require('mongoose')

const departments = new mongoose.Schema({
    Name: String,
    Manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }
}, {versionKey: false})

module.exports = mongoose.model('Department', departments)