const mongoose = require('mongoose')

const shift = new mongoose.Schema({
    Date: Date,
    StartHour: Number,
    EndHour: Number,
    Employees: Array,
}, {versionKey: false})

module.exports = mongoose.model('Shift', shift)