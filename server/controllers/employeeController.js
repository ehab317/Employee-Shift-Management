const express = require('express')
const router = express.Router()
const employeeService = require('../services/employeeService')

router.post('/addemployee', async (req, res) => {
    const employee = req.body
    const createdEmployee = await employeeService.createEmployee(employee)
    if (!createdEmployee.created) {
        return res.status(401).send(createdEmployee.massage)
    }
    return res.status(200).send(createdEmployee)
})

router.get('/', async (req, res) => {
    const employees = await employeeService.getAllEmployees()
    if(!employees) {
        return res.status(401).send({massage: 'failed to get employees, please try again'})
    }
    return res.status(200).send(employees)
})

router.get('/:id', async (req, res) => {
    const employee = await employeeService.getEmployeeById(req.params.id)
    if(!employee) {
        return res.status(401).send({massage: 'employee not found'})
    }
    return res.status(200).send({massage: 'employee found', employee: employee})
})

router.put('/editemployee', async (req, res) => {
    const  employee = req.body
    const updatedEmployee = await employeeService.updateEmployee(employee)
    if(!updatedEmployee) {
        return res.status(401).send({massage: 'failed to update employee, please try again'})
    }
    return res.status(200).send({message: 'employee updated successfully!', employee: updatedEmployee})
})

router.delete('/deleteemployee/:id', async (req, res) => {
    const id = req.params.id
    const deletedEmployee = await employeeService.deleteemployee(id)
    console.log(deletedEmployee)
    if(!deletedEmployee) {
        return res.status(401).send({massage: 'failed to delete employee, please try again'})
    }
    return res.status(200).send({message: 'employee deleted successfully!', employee: deletedEmployee})
})

module.exports = router