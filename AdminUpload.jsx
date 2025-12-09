import React, { useState } from 'react';
import axios from 'axios';

export default function AdminUpload({ onUploadSuccess }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      alert('Please provide both title and image');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = res.data.imageUrl;
      onUploadSuccess({ title, image: imageUrl });

      alert('✅ Upload successful!');
      setTitle('');
      setFile(null);
      setPreview('');
    } catch (err) {
      console.error(err);
      alert('❌ Upload failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-xl w-[400px] mx-auto mt-8 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Admin Image Upload</h2>
      <form onSubmit={handleUpload} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Preview" className="rounded mt-3" />}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-2"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}
