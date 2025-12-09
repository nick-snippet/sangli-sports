import React, { useState } from 'react'

const AdminPanel = ({ onUpload }) => {
  const [title, setTitle] = useState('')
  const [image, setImage] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title || !image) return alert('Please fill all fields.')

    const newEvent = {
      title,
      image: URL.createObjectURL(image),
    }

    onUpload(newEvent)
    setTitle('')
    setImage(null)
  }

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit">Upload Event</button>
      </form>
    </div>
  )
}

export default AdminPanel
