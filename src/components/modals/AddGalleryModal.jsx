import React, { useState } from "react";

export default function AddGalleryModal({ open, onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">

        <h2 className="text-xl font-semibold mb-4">Upload Gallery Image</h2>

        {/* Image Input */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0])}
          className="mb-3 w-full"
        />

        {/* Title Input */}
        <input
          type="text"
          placeholder="Enter short title (optional)"
          className="w-full border p-2 rounded mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>

          <button
            className="bg-blue-600 text-white px-5 py-2 rounded"
            onClick={() => {
              if (!file) return alert("Please select an image");
              onUpload(file, title);
            }}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
