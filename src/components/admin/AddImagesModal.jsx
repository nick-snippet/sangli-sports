//sumeet-sports\src\components\admin\AddImagesModal
import React, { useState, useEffect } from "react";

/**
 * Props:
 * - open: boolean
 * - onSave(filesArray) -> promise or callback
 * - onClose()
 */
export default function AddImagesModal({ open, onSave, onClose }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!open) setFiles([]); }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
        <h3 className="text-lg font-semibold mb-3">Add Images to Event</h3>

        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="w-full"
          />
          <p className="text-sm text-gray-600 mt-2">{files.length} file(s) selected</p>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200">Cancel</button>
          <button
            onClick={async () => {
              if (files.length === 0) { alert("Select one or more images."); return; }
              try {
                setLoading(true);
                await onSave(files);
              } catch (e) {
                console.error(e);
                alert("Upload failed");
              } finally {
                setLoading(false);
                onClose();
              }
            }}
            className="px-4 py-2 rounded-md bg-sky-200 text-white"
            disabled={loading}
          >
            {loading ? "Uploading..." : `Upload (${files.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
