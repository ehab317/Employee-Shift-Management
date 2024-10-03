const express = require('express')
const router = express.Router()
const shiftService = require('../services/shiftServices')

router.post('/addShift', async (req, res) => {
    const newShift = req.body
    const addShift = await shiftService.addShift(newShift)
    if(!addShift.created) {
        return res.status(401).send({massage: 'failed to create shift, please try again'})
    }
    return res.status(200).send({message: 'shift created successfully!', shift: addShift.shift})
})

router.get('/', async (req, res) => {
    const shifts = await shiftService.getShifts()
    if(!shifts) {
        return res.status(401).send({massage: 'failed to get shifts, please try again'})
    }
    return res.status(200).send(shifts)
})

router.get('/:id', async (req, res) => {
    const shift = await shiftService.getShift(req.params.id)
    if(!shift) {
        return res.status(401).send({massage: 'shift not found'})
    }
    return res.status(200).send({massage: 'shift found', shift: shift})
})

router.put('/editshift', async (req, res) => {
    const shift = req.body
    const updatedShift = await shiftService.updateShift(shift)
    if(!updatedShift) {
        return res.status(401).send({massage: 'failed to update shift, please try again'})
    }
    return res.status(200).send({message: 'shift updated successfully!', shift: updatedShift})
})

router.put('/addEmp', async (req, res) => {
    const {id, empId} = req.body
    const updatedShift = await shiftService.updateShiftEmp(id, empId)
    if(!updatedShift) {
        return res.status(401).send({massage: 'failed to add employee, please try again'})
    }
    return res.status(200).send({message: 'shift updated successfully!', shift: updatedShift})
})

router.put('/removeEmp', async (req, res) => {
    const {id, employeeId} = req.body
    const updatedShift = await shiftService.removeEmp(id, employeeId)
    if(!updatedShift) {
        return res.status(401).send({massage: 'failed to remove employee, please try again'})
    }
    return res.status(200).send({message: 'shift updated successfully!', shift: updatedShift})
})

module.exports = router
