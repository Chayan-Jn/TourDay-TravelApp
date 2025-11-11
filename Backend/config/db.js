const mongoose = require('mongoose')
require('dotenv').config()

const connectToDb = async (req,res)=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('db connected successfully')
    }
    catch(err){
        console.log('Error connecting to db')
    }
}

module.exports = connectToDb;