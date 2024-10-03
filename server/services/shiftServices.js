const shiftRepo = require('../repositories/shiftRepo')

const addShift = async (shift) => {
    const newShift = await shiftRepo.addShift(shift)
    return {created: true, shift: newShift}
}

const getShifts = async () => {
    const shifts = await shiftRepo.getShifts()
    return shifts
}

const getShift = async (id) => {
    const shift = await shiftRepo.getShiftById(id)
    return shift
}

const updateShift = async (shift) => {
    const updatedShift = await shiftRepo.findAndUpdate(shift.shift)
    return updatedShift
}

const updateShiftEmp = async (id, empId) => {
    const updatedShift = await shiftRepo.updateEmp(id, empId)
    return updatedShift
}

const removeEmp = async (id, empId) => {
    const updatedShift = await shiftRepo.removeEmp(id, empId)
    return updatedShift
}

module.exports = {addShift, getShifts, getShift, updateShift, updateShiftEmp, removeEmp}