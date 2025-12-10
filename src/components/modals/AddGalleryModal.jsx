import React, { useState } from "react";
import { motion } from "framer-motion";
import { addGalleryImage } from "../../firebase/gallery";

export default function AddGalleryModal({ open, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image!");

    try {
      setUploading(true);

      // 🔥 Upload to Firebase
      await addGalleryImage(file, title);

      // Reset form
      setUploading(false);
      setTitle("");
      setFile(null);

      // 🔁 Refresh Gallery
      if (onSave) await onSave();

      onClose(); // Close modal
    } catch (err) {
      console.log(err);
      alert("Failed to upload image.");
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4">Add New Gallery Image</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Optional Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter image title (optional)"
            className="w-full border px-3 py-2 rounded-lg"
          />

          {/* File Upload */}
          <label className="block font-semibold text-sm">Gallery Image</label>
          <label className="bg-pink-600 text-white px-4 py-2 rounded-lg w-fit cursor-pointer hover:bg-pink-700 transition">
            📸 Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          {file && <p className="text-sm text-gray-600">Selected: {file.name}</p>}

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Add Image"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
