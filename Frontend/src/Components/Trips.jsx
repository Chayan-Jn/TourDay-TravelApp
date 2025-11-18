import { useEffect, useState } from 'react'
import '../css/Trips.css'

export default function Trips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch('https://rkl6rjdf-3000.inc1.devtunnels.ms/get-all-trips', {
          credentials: 'include'
        })
        const data = await res.json()
        if (res.ok && data.success) setTrips(data.trips || [])
        else setError(data.message || 'Failed to fetch trips')
      } catch {
        setError('Could not connect to server')
      } finally {
        setLoading(false)
      }
    }
    fetchTrips()
  }, [])

  if (loading) return <p>Loading trips...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div className="trips-list">
      <h2>Available Trips</h2>
      <div className="trip-grid">
        {trips.map(trip => (
          <div
            key={trip._id}
            className="trip-card"
            onClick={() => window.location.href = `/trip/${trip._id}`}
          >
            <img
              src={trip.images[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={trip.title}
            />
            <h3>{trip.title}</h3>
            <p><strong>Destination:</strong> {trip.destination}</p>
            <p><strong>Price:</strong> ₹{trip.pricePerPerson}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
