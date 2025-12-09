// src/components/modals/EditCoachModal.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"; // adjust path if needed

export default function EditCoachModal({ open, coach = {}, onClose, onSuccess }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", title: "", instagram: "", description: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      name: coach.name || "",
      title: coach.title || "",
      instagram: coach.instagram || "",
      description: coach.description || "",
    });
    setFile(null);
    setLoading(false);
  }, [coach, open]);

  if (!open) return null;

  const getToken = async () => {
    if (!user) throw new Error("Not authenticated");
    return await user.getIdToken();
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("title", form.title);
      formData.append("instagram", form.instagram);
      formData.append("description", form.description);
      if (file) formData.append("image", file);

      const res = await fetch(`/api/coaches/${coach.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Update failed");
      }

      const updated = await res.json();
      onSuccess && onSuccess(updated);
      onClose();
    } catch (e) {
      console.error(e);
      alert("Update coach failed: " + (e.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
        <h3 className="text-xl font-semibold mb-4">Edit Coach</h3>

        <label className="block text-sm font-medium">Name</label>
        <input className="w-full mb-3 p-2 border rounded" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <label className="block text-sm font-medium">Title</label>
        <input className="w-full mb-3 p-2 border rounded" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

        <label className="block text-sm font-medium">Instagram</label>
        <input className="w-full mb-3 p-2 border rounded" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />

        <label className="block text-sm font-medium">Description</label>
        <textarea className="w-full mb-3 p-2 border rounded" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />

        <div className="mb-3">
          <label className="block text-sm font-medium">Replace Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white">{loading ? "Saving..." : "Save"}</button>
        </div>
      </div>
    </div>
  );
}
