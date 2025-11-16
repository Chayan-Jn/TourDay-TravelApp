import { useEffect, useState } from 'react'
import '../css/TripForm.css'

export default function TripForm() {
  const [trip, setTrip] = useState({
    title: '',
    description: '',
    destination: '',
    startDate: '',
    endDate: '',
    pricePerPerson: '',
    maxGroupSize: '',
    availableSeats: '',
    category: '',
    guide: { name: '', contact: '' },
    included: [],
    excluded: [],
    images: []
  })

  const [includedInput, setIncludedInput] = useState('')
  const [excludedInput, setExcludedInput] = useState('')
  const [imageInput, setImageInput] = useState('')
  const [isAdmin, setIsAdmin] = useState(null) // null = loading, false = not admin
  const [error, setError] = useState('')

  // ✅ check admin access on mount
  useEffect(() => {
    const checkAdmin = async () => {
      console.log('Checking admin access ')
      try {
        const res = await fetch('http://localhost:3000/admin/admin-check', { credentials: 'include' })
        console.log('res is ',res)
        const data = await res.json()
        console.log('Inside Trip Form, data is ',data)
        if (res.ok && data.success) {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
          setError(data.message || 'Access denied')
        }
      } catch (err) {
        console.log('trip err is ',err)
        setIsAdmin(false)
        setError('Could not verify admin access')
      }
    }
    checkAdmin()
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setTrip(prev => ({ ...prev, [name]: value }))
  }

  const handleGuideChange = e => {
    const { name, value } = e.target
    setTrip(prev => ({ ...prev, guide: { ...prev.guide, [name]: value } }))
  }

  const addToList = (field, input, setter) => {
    if (!input.trim()) return
    setTrip(prev => ({ ...prev, [field]: [...prev[field], input.trim()] }))
    setter('')
  }

  const removeFromList = (field, index) => {
    setTrip(prev => ({
      ...prev,
      [field]: prev[field].filter((elem, i) => i !== index)
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const res = await fetch('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // ✅ send cookie for auth
      body: JSON.stringify(trip)
    })
    const data = await res.json()
    alert(res.ok ? 'Trip created successfully!' : data.error)
  }

  // 🔸 show loading or denied access
  if (isAdmin === null) return <p>Checking admin access...</p>
  if (isAdmin === false) return <p style={{ color: 'red' }}>{error}</p>

  // ✅ if admin confirmed, show form
  return (
    <form onSubmit={handleSubmit} className="trip-form">
      <h2>Create a New Trip</h2>

      <label>Title</label>
      <input name="title" value={trip.title} onChange={handleChange} required />

      <label>Description</label>
      <textarea name="description" value={trip.description} onChange={handleChange} required />

      <label>Destination</label>
      <input name="destination" value={trip.destination} onChange={handleChange} required />

      <label>Start Date</label>
      <input type="date" name="startDate" value={trip.startDate} onChange={handleChange} required />

      <label>End Date</label>
      <input type="date" name="endDate" value={trip.endDate} onChange={handleChange} required />

      <label>Price Per Person</label>
      <input type="number" name="pricePerPerson" value={trip.pricePerPerson} onChange={handleChange} required />

      <label>Max Group Size</label>
      <input type="number" name="maxGroupSize" value={trip.maxGroupSize} onChange={handleChange} required />

      <label>Available Seats</label>
      <input type="number" name="availableSeats" value={trip.availableSeats} onChange={handleChange} required />

      <label>Category</label>
      <input name="category" value={trip.category} onChange={handleChange} placeholder="Adventure, Beach..." />

      {/* Included */}
      <div className="list-section">
        <label>Included</label>
        <div className="list-input">
          <input value={includedInput} onChange={e => setIncludedInput(e.target.value)} placeholder="Add item" />
          <button type="button" onClick={() => addToList('included', includedInput, setIncludedInput)}>Add</button>
        </div>
        <ul>
          {trip.included.map((elem, i) => (
            <li key={i}>
              {elem}
              <button type="button" onClick={() => removeFromList('included', i)}>×</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Excluded */}
      <div className="list-section">
        <label>Excluded</label>
        <div className="list-input">
          <input value={excludedInput} onChange={e => setExcludedInput(e.target.value)} placeholder="Add item" />
          <button type="button" onClick={() => addToList('excluded', excludedInput, setExcludedInput)}>Add</button>
        </div>
        <ul>
          {trip.excluded.map((elem, i) => (
            <li key={i}>
              {elem}
              <button type="button" onClick={() => removeFromList('excluded', i)}>×</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Images */}
      <div className="list-section">
        <label>Images</label>
        <div className="list-input">
          <input value={imageInput} onChange={e => setImageInput(e.target.value)} placeholder="Image URL" />
          <button type="button" onClick={() => addToList('images', imageInput, setImageInput)}>Add</button>
        </div>
        <ul>
          {trip.images.map((elem, i) => (
            <li key={i}>
              <a href={elem} target="_blank" rel="noreferrer">{elem}</a>
              <button type="button" onClick={() => removeFromList('images', i)}>×</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Guide */}
      <h3>Guide Details</h3>
      <input name="name" value={trip.guide.name} onChange={handleGuideChange} placeholder="Guide Name" />
      <input name="contact" value={trip.guide.contact} onChange={handleGuideChange} placeholder="Guide Contact" />

      <button type="submit">Create Trip</button>
    </form>
  )
}
