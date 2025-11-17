const Booking = require('../model/Booking')


const getUserBookings = async (req,res)=>{

    try{
        const userId = req.userInfo.id;
        const userBookings = await Booking.find({user:userId}).populate('trip','title destination startDate endDate pricePerPerson');
        if(userBookings.length == 0){
            return res.status(400).json({
                success:false,
                message:"No bookings yet"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Bookings fetched succesfully ",
            bookings:userBookings
        })
    }
    catch(err){
        console.log('Error while getting bookings ',err);
        return res.status(500).json({
            success:false,
            message:"Server error while getting bookings "
        })
    }
}

module.exports = {getUserBookings}