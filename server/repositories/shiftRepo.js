const shiftModel = require('../models/shiftModel')

const addShift = (shift) => {
    const newShift = new shiftModel(shift)
    return newShift.save()
}

const getShifts = () => {
    return shiftModel.find({})
}

const getShiftById = (id) => {
    return shiftModel.findById(id)
}

const findAndUpdate = (shift) => {
    return shiftModel.findByIdAndUpdate(
        shift._id,
        {$set: shift},
        {new: true}
    )
}

const updateEmp = (id, empId) => {
    return shiftModel.findByIdAndUpdate(
        id,
        {$push: {Employees: empId}},
        {new: true}
    )
}

const removeEmp = (id, empId) => {
    return shiftModel.findByIdAndUpdate(
        id,
        {$pull: {Employees: empId}},
        {new: true}
    )
}

module.exports = {addShift, getShifts, getShiftById, findAndUpdate, updateEmp, removeEmp}