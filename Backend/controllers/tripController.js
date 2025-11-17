const mongoose = require('mongoose');
const Booking = require('../model/Booking');
const Trip = require('../model/Trip');

const bookTrip = async (req, res) => {

    try {
        const userId = req.userInfo.id;
        const { source, seatsBooked, dateBooked, tripId } = req.body; 

        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
              success: false,
              message: "Invalid trip ID"
            })
        }
          

        // availableSeats: {$gte:seatsBooked} only apply the change if this is true
        const trip = await Trip.findOneAndUpdate(
            { _id: tripId, availableSeats: { $gte: seatsBooked } },  
            { $inc: { availableSeats: -seatsBooked } },
            { new: true } 
        );
        
        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found or not enough space'
            });
        }

        const newBooking = await Booking.create({
            user:userId,
            trip:tripId,
            seatsBooked,
            source,
            dateBooked
        });

        return res.status(201).json({
            success:true,
            message:"Booking completed successfully ",
            booking:newBooking,
            updatedSeats: trip.availableSeats       
        })
    }
    catch (err) {
        console.log('Error occurred while booking the trip ',err);
        return res.status(500).json({
            success: false,
            message: "Error occurred while booking the trip "
        })
    }
}

const getAllTrips = async (req,res)=>{
    try{
          
        const allTrips = await Trip.find({});
        if(allTrips.length === 0){
            return res.status(404).json({
                success:false,
                message:"No Trips found "
            })
        }
        return res.status(200).json({
            success:true,
            message:"Trips fetched successfully ",
            trips:allTrips
        })
        
    }
    catch(err){
        console.log('Error while fetching the trips ',err);
        return res.status(500).json({
            success:false,
            message:"Error while getting the trips  "
        })
    }
}

const getTripData = async (req,res)=>{

    try{
        const {tripId} = req.body;

        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
              success: false,
              message: "Invalid trip ID"
            })
          }
          

        const currentTrip = await Trip.findById(tripId);
        if(!currentTrip){
            return res.status(404).json({
                success:false,
                message:"Trip does not exist or is not active "
            })
        }
        return res.status(200).json({
            success:true,
            message:"Trip fetched successfully ",
            trip:currentTrip
        })
    }
    catch(err){
        console.log('Error while fetching the trip ',err);
        return res.status(500).json({
            success:false,
            message:"Error while getting the trip details "
        })
    }


}

module.exports = {bookTrip,getTripData,getAllTrips};