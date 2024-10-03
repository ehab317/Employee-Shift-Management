const express = require('express')
const router = express.Router()
const depService = require('../services/depService')

router.post('/addDepartment', async (req, res) => {
    const dep = req.body
    const createdDep = await depService.addDep(dep)
    if(!createdDep.created) {
        return res.status(401).send(createdDep.massage)
    }
    return res.status(200).send(createdDep)
})

router.get('/', async (req, res) => {
    const deps = await depService.getAllDepartments()
    if(!deps) {
        return res.status(401).send({massage: 'failed to get departments, please try again'})
    }
    return res.status(200).json(deps)
})

router.get('/names', async (req, res) => {
    const depnames = await depService.getDepartmentnames()
    if(!depnames) {
        return res.status(401).send({massage: 'failed to get departments, please try again'})
    }
    return res.status(200).json(depnames)
})

router.get('/:id', async (req, res) => {
    const dep = await depService.getDepartment(req.params.id)
    if(!dep) {
        return res.status(401).send({massage: 'department not found'})
    }
    return res.status(200).json({massage: 'department found', dep: dep})
})

router.put('/editDepartment', async (req, res) => { 
    const {id, newDep} = req.body
    const updatedDep = await depService.updateDep(id, newDep)
    if(!updatedDep) {
        return res.status(401).send({massage: 'failed to update department, please try again'})
    }
    return res.status(200).send({massage: 'department updated successfully!', dep: updatedDep})
})

router.delete('/deleteDepartment/:id', async (req, res) => {
    const id = req.params.id
    const deletedDep = await depService.deleteDep(id)
    if(!deletedDep) {
        return res.status(401).send({massage: 'failed to delete department, please try again'})
    }
    return res.status(200).send({message: 'department deleted successfully!', dep: deletedDep})
})

module.exports = router