import { useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../css/Booking.css';

const Booking = () => {
  const { tripId } = useParams();

  const location = useLocation();
  const trip = location.state?.trip;

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
      console.log('trip id ',tripId)
      const res = await fetch('https://rkl6rjdf-3000.inc1.devtunnels.ms/book-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user:userData._id,
          tripId:trip._id,
          seatsBooked,
          source,
          dateBooked: new Date(),
          phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking failed');
      alert(`Booking successful! Total: ₹${totalPrice}`);
      
      setPhone('');
      setSeatsBooked('');
      setSource('Delhi');

    } catch (err) {
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
