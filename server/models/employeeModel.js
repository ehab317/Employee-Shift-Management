const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    StartWorkYear: String,
    DepartmentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }
}, {versionKey: false})

module.exports = mongoose.model('Employee', employeeSchema)