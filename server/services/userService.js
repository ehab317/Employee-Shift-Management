const userRepo = require('../repositories/userRepo')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const getUserByUsername = async (user) => {
    const username = user.username
    const email = user.email

    const allUsers = await userRepo.getAllUsers()
    const userFound = allUsers.find(u => u.username === username)

    if(!userFound) {return {success: false, massage: 'user not found'}}
    if(userFound.email !== email) {return {success: false, massage: 'wrong email'}}
    const userObj = {id: userFound.id, name: userFound.name, username: userFound.username, email: userFound.email}
    userToSave(userObj)
    const token = jwt.sign({user: userObj.username}, process.env.JWTSECRET, { expiresIn: '48h'})
    return {success: true, userObj, token}
}

const userToSave = async (user) => {
    const allUsers = await userRepo.getDbUsers()
    const thisUser = allUsers.find( u => u.FullName === user.name)
    if(!thisUser) {
        const userToSave = {FullName: user.name, maxActions: 7}
        userRepo.saveUser(userToSave)
    }
    return
}

const getUserByToken = async (token) => {
    const {user} = jwt.verify(token, process.env.JWTSECRET)
    const allUsers = await userRepo.getAllUsers()
    const userFound = allUsers.find(u => u.username === user)
    const userObj = {username: userFound.username, email: userFound.email}
    return getUserByUsername(userObj)

}

const getAllUsers = async () => {
    const allUsers = await userRepo.getAllUsers()
    const actions = await userRepo.getActions()
    allUsers.forEach( user => {
        const userActions = actions.filter(a => a.id === user.id)
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0'); // Get the day and ensure 2 digits
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Get the month (0-indexed, so add 1) and ensure 2 digits
        const year = today.getFullYear();
        const formattedToday = `${day}/${month}/${year}`; // Format 'DD/MM/YYYY'
      
        // Filter actions for today
        const todaysActions = userActions.filter(action => action.date === formattedToday);
        // If no actions for today, return null
        if (todaysActions.length === 0) {
            
          return user.latestAction = null, user.maxActions = 7;
        }
      
        // Sort by actionsAllowed to get the latest action (assuming latest means highest value)
        const latestAction = todaysActions.sort((a, b) => a.actionsAllowed - b.actionsAllowed)[0];
        user.latestAction = latestAction
        user.maxActions = latestAction.maxActions
    })
    return allUsers
}

module.exports = { getUserByUsername , getUserByToken, getAllUsers}