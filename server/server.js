const express = require('express')
const app = express()
const userRouter = require('./controllers/userController')
const employeeRouter = require('./controllers/employeeController')
const depRouter = require('./controllers/depController')
const shiftController = require('./controllers/shiftController')
const session = require('express-session')
const cors = require('cors')
const secret = process.env.SESSION_SECRET
const CORS_ORIGIN = process.env.CORS_ORIGIN
const handleUserActions = require('./utils').handleUserActions


//middlewares
app.use(cors({
    origin: `${CORS_ORIGIN}`,
    credentials: true
}))
require('dotenv').config()
app.use(express.json())

app.use(session({
    secret: secret,  // A secret key to sign the session ID cookie.
    resave: false,              // Avoid resaving session if unmodified.
    saveUninitialized: false,   // Don't save an uninitialized session.
    cookie: { 
        secure: false,           // Set to true if using HTTPS.
        sameSite: 'Lax',
        httpOnly: true
    },
}));

//middleware to check how many actions a user has left, if no actions sign him out
app.use((req, res, next) => {
    const id = req.session.userId
    if(!id) {
        return next()
    }
    const checkActions = async () => {
        const {allowed} = await handleUserActions(id)
        if(!allowed) {
            return res.status(403).send({message: 'you have reached your limit'})
        }
        next()
    }
    checkActions()

})

//routes
app.use('/users', userRouter)
app.use('/employees', employeeRouter)
app.use('/departments', depRouter)
app.use('/shifts', shiftController)

require('./config/DBconfig')
const port = process.env.PORT || 8000

app.listen(port, () => console.log(`server is running on port ${port}`))