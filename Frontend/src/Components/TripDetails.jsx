import { useEffect, useState } from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import '../css/TripDetails.css'

export default function TripDetails() {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await fetch('https://rkl6rjdf-3000.inc1.devtunnels.ms/get-trip-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ tripId: id })
        })
        const data = await res.json()
        if (res.ok && data.success) setTrip(data.trip)
        else setError(data.message || 'Failed to load trip')
      } catch {
        setError('Server error')
      } finally {
        setLoading(false)
      }
    }
    fetchTrip()
  }, [id])

  if (loading) return <p className="loading">Loading trip details...</p>
  if (error) return <p className="error">{error}</p>
  if (!trip) return null

  return (
    <div className="trip-container">
      <div className="trip-banner" style={{ backgroundImage: `url(${trip.images[0]})` }}>
        <div className="banner-overlay">
          <h1>{trip.title}</h1>
          <p>{trip.destination} | {trip.startDate} - {trip.endDate}</p>
        </div>
      </div>

      <div className="trip-details">
        <div className="trip-info-cards">
          <div className="info-card">
            <h3>Price per person</h3>
            <p>₹{trip.pricePerPerson}</p>
          </div>
          <div className="info-card">
            <h3>Available Seats</h3>
            <p>{trip.availableSeats}</p>
          </div>
          <div className="info-card">
            <h3>Guide</h3>
            <p>{trip.guide.name}<br />{trip.guide.contact}</p>
          </div>
        </div>

        <section>
          <h3>Description</h3>
          <p>{trip.description}</p>
        </section>

        <section className="includes-excludes">
          <div>
            <h3>Included</h3>
            <ul>{trip.included.map((item, i) => <li key={i}>{item}</li>)}</ul>
          </div>
          <div>
            <h3>Excluded</h3>
            <ul>{trip.excluded.map((item, i) => <li key={i}>{item}</li>)}</ul>
          </div>
        </section>

        <section>
          <h3>Hotels</h3>
          <ul className="hotels-list">
            {trip.hotels.map((hotel, i) => (
              <li key={i}>
                {hotel.link ? <a href={hotel.link} target="_blank" rel="noreferrer">{hotel.name}</a> : hotel.name}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Itinerary</h3>
          {trip.itinerary.map(day => (
            <div key={day.day} className="itinerary-day">
              <h4>Day {day.day}</h4>
              <ul>{day.activities.map((act, i) => <li key={i}>{act}</li>)}</ul>
            </div>
          ))}
        </section>

        <section>
          <h3>Gallery</h3>
          <div className="trip-images">
            {trip.images.map((img, i) => (
              <img key={i} src={img} alt={`Trip ${i}`} />
            ))}
          </div>
        </section>
        <div className='book-div'>
            <button onClick={() => navigate(`/booking/${id}`, { state: { trip } })}>Book Now</button>
        </div>
      </div>
    </div>
  )
}
