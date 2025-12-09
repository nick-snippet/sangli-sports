import React, { useState, useEffect } from "react";

/**
 * Props:
 * - open: boolean
 * - currentUrl: string (preview)
 * - onSave(file) -> promise or callback
 * - onClose()
 */
export default function ReplaceImageModal({ open, currentUrl, onSave, onClose }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!open) { setFile(null); setLoading(false); } }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-semibold mb-3">Replace Image</h3>

        <div className="mb-4">
          <img src={currentUrl} alt="preview" className="w-full h-48 object-cover rounded-md mb-3" />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200">Cancel</button>
          <button
            onClick={async () => {
              if (!file) { alert("Please choose an image."); return; }
              try {
                setLoading(true);
                await onSave(file);
              } catch (e) {
                console.error(e);
                alert("Upload failed");
              } finally {
                setLoading(false);
                onClose();
              }
            }}
            className="px-4 py-2 rounded-md bg-blue-400 text-white"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
