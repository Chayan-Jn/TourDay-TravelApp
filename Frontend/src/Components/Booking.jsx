import { useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../css/Booking.css';

const Booking = () => {
  const { tripId } = useParams();

  // const location = useLocation();
  const [trip,setTrip] = useState(null);

  const [userData, setUserData] = useState('');
  const [phone, setPhone] = useState('');
  const [seatsBooked, setSeatsBooked] = useState(''); // start empty
  const [source, setSource] = useState('Delhi');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('Sending request for login check');
        const res = await fetch('https://rkl6rjdf-3000.inc1.devtunnels.ms/login-check', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
        console.log('User data:', data);
        setUserData(data.user); // autofill username
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  useEffect( ()=>{

    const fetchTripDetail = async ()=>{
        const tripRes = await fetch(`https://rkl6rjdf-3000.inc1.devtunnels.ms/get-trip-data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tripId:tripId }),
          credentials: 'include',
        });
        const tripData = await tripRes.json();
        if (tripData.success) {
            setTrip(tripData.trip);
        }
    }
    fetchTripDetail()

  },[])

  if (!trip) return <p className="error">Trip data not found!</p>;

  const totalPrice = seatsBooked ? seatsBooked * trip.pricePerPerson : 0;

  const handleBooking = async () => {
    if (!phone) {
      alert('Please enter your phone number');
      return;
    }
    if (!seatsBooked || seatsBooked < 1) {
      alert('Please enter valid number of seats');
      return;
    }

    try {

      // #1 : Create Razorpay order
      const orderRes = await fetch('https://rkl6rjdf-3000.inc1.devtunnels.ms/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          tripId: trip._id,
          seatsBooked,
          phone,
        }),
      });

      

      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.message || 'Order creation failed');

      const { key, order, amount } = orderData;

      // Step 2: Open Razorpay checkout
      const options = {
        key,
        amount: amount * 100,
        currency: 'INR',
        name: 'Trip Booking',
        description: `Booking for ${trip.title}`,
        order_id: order.id,
        handler: async function (response) {
          // Step 3: Verify payment & book trip
          const verifyRes = await fetch('https://rkl6rjdf-3000.inc1.devtunnels.ms/book-trip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              user: userData._id,
              tripId: trip._id,
              seatsBooked,
              source,
              dateBooked: new Date(),
              phone,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const data = await verifyRes.json();
          if (!data.success) throw new Error(data.message || 'Booking failed');
          if (data.success) {
            alert(`Booking successful! Total: ₹${totalPrice}`);
              // Refetch updated trip
              const tripRes = await fetch(`https://rkl6rjdf-3000.inc1.devtunnels.ms/get-trip-data`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ tripId: trip._id }),
                  credentials: 'include',
              });
              const tripData = await tripRes.json();
              if (tripData.success) {
                  setTrip(tripData.trip);
              }
          
              setPhone('');
              setSeatsBooked('');
              setSource('Delhi');
          }
        },
        prefill: {
          name: userData.username,
          contact: phone,
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } 
    catch (err) {
      alert('Booking failed: ' + err.message);
    }
  };

  return (
    <div className="booking-container">
      <h1 className="booking-title">Book Trip: {trip.title}</h1>
      <p className="trip-info">Available Seats: {trip.availableSeats}</p>
      <p className="trip-info">Price per Person: ₹{trip.pricePerPerson}</p>

      <div className="form-group">
        <label>Name:</label>
        <input type="text" value={userData.username} readOnly />
      </div>

      <div className="form-group">
        <label>Phone:</label>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="Enter phone number"
        />
      </div>

      <div className="form-group">
        <label>Seats:</label>
        <input
          type="number"
          value={seatsBooked}
          placeholder="Enter number of seats"
          onChange={e => {
            const val = e.target.value;
            if (val === '') {
              setSeatsBooked(''); // allow clearing input
              return;
            }
            let numVal = Number(val);
            if (numVal > trip.availableSeats) numVal = trip.availableSeats;
            if (numVal < 1) numVal = 1;
            setSeatsBooked(numVal);
          }}
        />
      </div>

      <div className="form-group">
        <label>Source:</label>
        <select value={source} onChange={e => setSource(e.target.value)}>
          <option>Delhi</option>
          <option>Noida</option>
          <option>Gurgaon</option>
          <option>Faridabad</option>
        </select>
      </div>

      <p className="total-price">Total Price: ₹{totalPrice}</p>

      <button className="booking-button" onClick={handleBooking}>
        Confirm Booking
      </button>
    </div>
  );
};

export default Booking;
