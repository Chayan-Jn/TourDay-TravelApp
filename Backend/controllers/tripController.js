const mongoose = require('mongoose');
const Booking = require('../model/Booking');
const Trip = require('../model/Trip');
const Razorpay = require('razorpay')
const crypto = require('crypto');

// const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')
     
// razorpay initilization
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

// Need to create order before payment
const createOrder = async (req,res)=>{
    try{
        const {tripId,seatsBooked,phone} = req.body;

        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
              success: false,
              message: "Invalid trip ID"
            })
        };
        const trip = await Trip.findById(tripId);
        if (!trip || trip.availableSeats < seatsBooked) {
          return res.status(404).json({
            success: false,
            message: 'Trip not found or not enough seats',
          });
        }    

        const totalAmount = trip.pricePerPerson * seatsBooked * 100; // Razorpay uses paise so we need pass paise not rupees

        const options = {
          amount: totalAmount,
          currency: 'INR',
          receipt:`trip_${tripId.toString().slice(-6)}_${Date.now().toString().slice(-6)}`
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            key: process.env.RAZORPAY_KEY_ID,
            order,
            amount: totalAmount / 100,
        });
    }
    catch (err) {
        console.error('Error while creating Razorpay order ', err);
        return res.status(500).json({
          success: false,
          message: 'Error while  Razorpay order',
        });
      }
    
}


const bookTrip = async (req, res) => {

    try {
        const userId = req.userInfo.id;
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            tripId,
            seatsBooked,
            source,
            dateBooked,
            phone,
        } = req.body;

        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            return res.status(400).json({
              success: false,
              message: "Invalid trip ID"
            })
        }

        // Need to veriy Razorpya payment signature before booking
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
              success: false,
              message: 'Payment verification failed',
            });
          }
          

        // available                                         Seats-> {$gte:seatsBooked} only apply the change if this is true
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
            user: userId,
            trip: tripId,
            seatsBooked,
            source,
            dateBooked,
            phone,
            paymentId: razorpay_payment_id,
          });

        return res.status(201).json({
            success:true,
            message:"Payment verified, Booking completed successfully ",
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

module.exports = {createOrder,bookTrip,getTripData,getAllTrips};