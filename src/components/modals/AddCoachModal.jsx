// src/components/modals/AddCoachModal.jsx
import React, { useState } from "react";
import { addCoach } from "../../firebase/coaches.js";


export default function AddCoachModal({ open, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  if (!open) return null;

  // 🔎 Image validation (only message, not strict block)
  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setErr("⚠️ Please upload a valid image (jpg, jpeg, png).");
      setFile(null);
      return;
    }

    setErr("");
    setFile(selected);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !title || !description || !file) {
      setErr("⚠️ Please fill all fields & upload an image.");
      return;
    }

    try {
      setErr("");
      setLoading(true);

      await addCoach({ name, title, description, file });

      // Reset & Close
      setName("");
      setTitle("");
      setDescription("");
      setFile(null);
      setLoading(false);

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      setLoading(false);
      setErr(error.message || "Upload failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 max-w-lg w-full bg-white rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-semibold mb-3">Add New Coach</h3>
        {err && <div className="text-sm text-red-600 mb-2">{err}</div>}

        <form onSubmit={submit} className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Coach name"
            className="w-full px-3 py-2 border rounded"
          />

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title / role"
            className="w-full px-3 py-2 border rounded"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description / bio"
            className="w-full px-3 py-2 border rounded"
            rows={4}
          />

          {/* 📤 Upload Button */}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Image</span>

            <label
              htmlFor="coachFile"
              className="mt-2 inline-block px-4 py-2 bg-pink-600 text-white text-sm rounded cursor-pointer hover:bg-pink-700 transition"
            >
              📤 Upload Image
            </label>

            <input
              id="coachFile"
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />

            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#0f2547] text-white rounded"
            >
              {loading ? "Uploading..." : "Add Coach"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
