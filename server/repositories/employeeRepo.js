const employeesModel = require('../models/employeeModel')

const getAllEmployees =  () => {
    return employeesModel.find({})
}

const getEmployeesByDep = (dep) => {
    return employeesModel.find({Department: dep})
}

const getEmployeeById = (id) => {
    return employeesModel.findById(id)
}

const saveEmployee = async (employee) => {
    employee = new employeesModel(employee)
    return await employee.save()
}

const updateEmployee = (employee) => {
    return employeesModel.findByIdAndUpdate(employee._id, employee, {new: true})
}


const deleteemployee = (id) => {
    return employeesModel.findByIdAndDelete(id)
}



module.exports = { getAllEmployees, getEmployeesByDep, getEmployeeById, saveEmployee, updateEmployee, deleteemployee }