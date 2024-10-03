const employeeRepo = require('../repositories/employeeRepo')
const depRepo = require('../repositories/depRepo')
const shiftRepo = require('../repositories/shiftRepo')

const createEmployee = async (employee) => {
    const allEmployees = await employeeRepo.getAllEmployees()
    const existes = allEmployees.find(e => e.FirstName === employee.FirstName && e.LastName === employee.LastName)
    if(existes) {
        return {created: false, massage: 'employee already exists'}
    }
    console.log(employee)
    const saveEmployee = await employeeRepo.saveEmployee(employee)
    console.log(saveEmployee)
    return {created: true, saveEmployee}
}

const getAllEmployees = async () => {
    const employees =  await employeeRepo.getAllEmployees()
    const deps = await depRepo.getAllDepartments()
    const employeesWithDep = employees.map(e => {
        const dep = deps.find(d => d._id.equals(e.DepartmentID))
        return {...e._doc, Department: dep}
    })

    const shifts = await shiftRepo.getShifts()

    employeesWithDep.forEach(employee => {
        // Add a 'shifts' array to each employee
        employee.shifts = [];
      
        // Iterate through each shift
        shifts.forEach(shift => {
          // Check if the employee's ID is in the shift's employees array
          if (shift.Employees.includes(employee._id)) {
            // If yes, push the shift to the employee's shifts array
            employee.shifts.push(shift);
          }
        });
      });

    return employeesWithDep
}

const getEmployeeById = async (id) => {
    const employee = await employeeRepo.getEmployeeById(id)
    return employee
}

const updateEmployee = async (employee) => {
    const updatedEmployee = await employeeRepo.updateEmployee(employee)
    return updatedEmployee
}

const deleteemployee = async (id) => {
    const deletedEmployee = await employeeRepo.deleteemployee(id)
    if (deletedEmployee) {
      const shifts = await shiftRepo.getShifts()
      shifts.forEach(async shift => {
        if (shift.Employees.includes(id)) {
          shift.Employees = shift.Employees.filter(employee => employee !== id)
          await shiftRepo.findAndUpdate(shift)
        }
      })
    }
    return deletedEmployee
}

module.exports = { createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteemployee }