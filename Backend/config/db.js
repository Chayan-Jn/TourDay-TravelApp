const mongoose = require('mongoose')


const connectToDb = async (req,res)=>{
    try{
        await mongoose.connect('mongodb+srv://cj:cj@cluster0.ymlj1du.mongodb.net/TravelApp');
        console.log('db connected successfully')
    }
    catch(err){
        console.log('Error connecting to db')
    }
}

module.exports = connectToDb;