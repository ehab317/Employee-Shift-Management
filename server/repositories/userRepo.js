const axios = require('axios')
require('dotenv').config()
const jf = require('jsonfile')
const userSchema = require('../models/userModel')
const actionsJson = './data/userActions.json'
const usersApi = process.env.USERSAPI

const getAllUsers = async () => {
    const {data} = await axios.get(usersApi)
    return data
}

const getDbUsers = () => {
    return userSchema.find({})
}

const getUserById = async (id) => {
    const {data} = await axios.get(`${usersApi}/${id}`)
    return data
}

const getActions =  async () => {
    const {userActions} = await jf.readFile(actionsJson)
    return userActions
}

const saveAction = async (action) => {
    const {userActions} = await jf.readFile(actionsJson)
    await jf.writeFile(actionsJson, {userActions: [...userActions, action]}, (err) => {
        if (err) {
            console.error('Error writing to file:', err)
          }
    })
}

const saveUser = (user) => {
    const newuser = new userSchema(user)
    return newuser.save()
}

module.exports = { getAllUsers, getUserById, getActions, saveUser, getDbUsers, saveAction} 