// src/components/modals/EditGalleryModal.jsx
import React, { useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function EditGalleryModal({ open, onClose, imageData, onSaved }) {
  // imageData: { id, title, category, url }
  const { user } = useAuth();
  const [title, setTitle] = useState(imageData?.title || "");
  const [category, setCategory] = useState(imageData?.category || "");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // update local state when imageData changes
  React.useEffect(() => {
    setTitle(imageData?.title || "");
    setCategory(imageData?.category || "");
    setFile(null);
    setError("");
  }, [imageData]);

  if (!open) return null;

  const getAuthHeader = async () => {
    if (!user) return {};
    // If your user object provides getIdToken:
    const token = typeof user.getIdToken === "function" ? await user.getIdToken() : user.token;
    return { Authorization: `Bearer ${token}` };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const headers = await getAuthHeader();

      const form = new FormData();
      form.append("title", title || "");
      form.append("category", category || "");
      if (file) form.append("image", file);

      const resp = await api.put(`/gallery/${imageData.id}`, form, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      });

      onSaved && onSaved(resp.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this image?");
    if (!ok) return;

    try {
      setLoading(true);
      const headers = await getAuthHeader();
      await api.delete(`/gallery/${imageData.id}`, { headers });
      onSaved && onSaved(null, { deleted: true, id: imageData.id });
      onClose();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || err.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-bold mb-4">Edit Gallery Image</h3>

        {imageData?.url && (
          <div className="mb-4">
            <img src={imageData.url} alt={imageData.title || "preview"} className="w-full h-56 object-cover rounded-md" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title (optional)</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category (optional)</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="row1 / row2 / row3 / row4 or custom" className="mt-1 block w-full rounded-md border px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Replace Image (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-2" />
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <div className="flex gap-3 justify-end mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>

            <button type="button" onClick={handleDelete} disabled={loading} className="px-4 py-2 rounded-md bg-red-500 text-white">
              Delete
            </button>

            <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-sky-600 text-white">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
