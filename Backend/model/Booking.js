const mongoose = require('mongoose');
const User = require('./User')
const Trip = require('./Trip')

const Schema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    trip:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    seatsBooked:{
        type:Number,
        required:true
    },
    dateBooked:{
        type:Date,
        required:true
    },
    source: { 
        type: String, 
        enum: ['Delhi', 'Noida', 'Gurgaon', 'Faridabad'],
        required: true
    }

},{timestamps:true})

module.exports = mongoose.model('Booking',Schema);