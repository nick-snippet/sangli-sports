import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminUpload({ onUploadSuccess }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) return alert("Enter title and choose image");

    const form = new FormData();
    form.append("image", file);

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/upload`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = res.data.imageUrl || "";
      const newEvent = { title, description: "", image: imageUrl };
      if (typeof onUploadSuccess === "function") onUploadSuccess(newEvent);

      setTitle("");
      setFile(null);
      alert("Uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg p-6 shadow">
      <h3 className="text-xl font-semibold mb-4 text-center">Admin Image Upload</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Event title" className="w-full p-3 border rounded" />
        <input type="file" accept="image/*" onChange={handleFile} />
        <div className="text-center">
          <button className="mt-3 px-6 py-2 rounded bg-green-600 text-white" disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </div>
  );
}
