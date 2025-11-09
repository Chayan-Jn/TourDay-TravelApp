const express = require('express')
const connectToDb = require('./config/db')

const app = express()

app.use(express.json())

console.log("hi")
connectToDb()

app.listen(3000,()=>{
    console.log("Server listening on port 3k")
})