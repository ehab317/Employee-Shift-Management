const mongoose = require('mongoose')
const DBURL = process.env.DB_URL

mongoose.connect(DBURL).then( () => console.log('DB connected') ).catch(  (err) => console.log(err) )