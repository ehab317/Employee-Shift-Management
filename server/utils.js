const userRepo = require('./repositories/userRepo')

const handleUserActions = async (id) => {
    const allActions = await userRepo.getActions()
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); // Get the day and ensure 2 digits
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Get the month (0-indexed, so add 1) and ensure 2 digits
    const year = today.getFullYear();
    const formattedToday = `${day}/${month}/${year}`; // Format 'DD/MM/YYYY'
    const todayActions = allActions.filter(action => action.id === id && action.date === formattedToday)
    let remainingActions
    if (todayActions.length) {
        const latestAction = todayActions.sort((a, b) => a.actionsAllowed - b.actionsAllowed)[0]
        remainingActions = latestAction.actionsAllowed
    } else {
        remainingActions = 7
    }
    if (remainingActions === 0) {
        return {allowed: false}
    } else {
        const newAction = {id: id, maxActions: 7, date: formattedToday, actionsAllowed: remainingActions-1}
        const addAction = await userRepo.saveAction(newAction)
        return {allowed: true}
    }
}

module.exports = {handleUserActions}