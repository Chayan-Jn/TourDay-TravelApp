const mongoose = require('mongoose')


const connectToDb = async (req,res)=>{
    try{
        await mongoose.connect('mongodb+srv://aryan23hcs4184_db_user:qwGnSRYNyXPNDqyX@cluster0.gnklmtg.mongodb.net/TravelApp');
        console.log('db connected successfully')
    }
    catch(err){
        console.log('Error connecting to db')
    }
}

module.exports = connectToDb;