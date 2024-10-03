const depRepo = require('../repositories/depRepo')
const employeeRepo = require('../repositories/employeeRepo')

const addDep = async (dep) => {

    const departments = await depRepo.getAllDepartments()
    const existes = departments.find(d => d.Name === dep.Name)
    if (existes) {
        return {created: false, massage: 'department already exists'}
    }
    const saveDep = await depRepo.saveDep(dep)
    return {created: true, massage: 'department created successfully!', dep: saveDep}
}

const getAllDepartments = async () => {
    const deps = await depRepo.getAllDepartments()
    const employees = await employeeRepo.getEmployeesByDep()
    const departmentEmps = deps.map( dep => {
        const emps = employees.filter(e => e.DepartmentID.equals(dep._id))
        return {...dep._doc, employees: emps}
    })
    return departmentEmps
}

const getDepartmentnames = async () => {
    const deps = await depRepo.getAllDepartments()
    const depnames = deps.map(dep => dep.Name)
    return depnames
}

const getDepartment = async (id) => {
    const deps = await depRepo.getAllDepartments()
    const dep = deps.find(dep => dep._id.equals(id))
    return dep
}

const updateDep = async (id, dep) => {
    const updatedDep = await depRepo.updateDep(id, dep)
    return updatedDep
}

const deleteDep = async (id) => {
    const deletedDep = await depRepo.deleteDep(id)
    if(deletedDep) {
        const emps = await employeeRepo.getAllEmployees()
        emps.forEach(async emp => {
            if(emp.DepartmentID.equals(id)) {
                emp.DepartmentID = null
                await employeeRepo.updateEmployee(emp._id, emp)
            }
        })
    }
    
    return deletedDep
}

module.exports = { addDep, getAllDepartments, getDepartmentnames, getDepartment, updateDep, deleteDep }