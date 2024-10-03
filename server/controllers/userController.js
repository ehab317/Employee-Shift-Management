const express = require('express')
const router = express.Router()
const userService = require('../services/userService')

router.post('/login', async (req, res) => {
    const user = req.body
    const userFound = await userService.getUserByUsername(user)
    if(!userFound.success) {return res.send(userFound.massage)}
    if(!req.session.userId) {
        req.session.userId = userFound.userObj.id
    }
    return res.send(userFound)
})

router.get('/login/:token', async (req, res) => {
    const token = req.params.token
    const userFound = await userService.getUserByToken(token)
    if(!userFound.success) {return res.send(userFound.massage)}
    if(!req.session.userId) {
        req.session.userId = userFound.userObj.id
    }
    return res.send(userFound)
})

router.get('/', async (req,res) => {
    const users = await userService.getAllUsers();
    const id = req.session.userId
    if(!users) {
        return res.status(401).send({massage: 'failed to get users, please try again'})
    }
    return res.status(200).send(users)
})

module.exports = router