import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../css/TripDetails.css'

export default function TripDetails() {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

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

  if (loading) return <p>Loading trip details...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!trip) return null

  return (
    <div className="trip-details">
      <h2>{trip.title}</h2>
      <p><strong>Destination:</strong> {trip.destination}</p>
      <p><strong>Dates:</strong> {trip.startDate} to {trip.endDate}</p>
      <p><strong>Price per person:</strong> ₹{trip.pricePerPerson}</p>
      <p><strong>Available Seats:</strong> {trip.availableSeats}</p>

      <h3>Description</h3>
      <p>{trip.description}</p>

      <h3>Included</h3>
      <ul>{trip.included.map((item, i) => <li key={i}>{item}</li>)}</ul>

      <h3>Excluded</h3>
      <ul>{trip.excluded.map((item, i) => <li key={i}>{item}</li>)}</ul>

      <h3>Hotels</h3>
      <ul>
        {trip.hotels.map((hotel, i) => (
          <li key={i}>
            {hotel.link ? <a href={hotel.link} target="_blank" rel="noreferrer">{hotel.name}</a> : hotel.name}
          </li>
        ))}
      </ul>

      <h3>Itinerary</h3>
      {trip.itinerary.map(day => (
        <div key={day.day}>
          <strong>Day {day.day}:</strong>
          <ul>{day.activities.map((act, i) => <li key={i}>{act}</li>)}</ul>
        </div>
      ))}

      <h3>Guide</h3>
      <p>{trip.guide.name} – {trip.guide.contact}</p>

      <h3>Images</h3>
      <div className="trip-images">
        {trip.images.map((img, i) => (
          <img key={i} src={img} alt={`Trip ${i}`} />
        ))}
      </div>
    </div>
  )
}
