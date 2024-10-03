const DepModel = require('../models/depModel')

const getAllDepartments = () => {
    return DepModel.find({}).populate('Manager')
}

const saveDep = async (dep) => {
    dep = new DepModel(dep)
    return await dep.save()
}

const updateDep = (id, dep) => {
    return DepModel.findByIdAndUpdate(id, dep, {new: true})
}

const deleteDep = (id) => {
    return DepModel.findByIdAndDelete(id)
}

module.exports = { getAllDepartments, saveDep, updateDep, deleteDep }