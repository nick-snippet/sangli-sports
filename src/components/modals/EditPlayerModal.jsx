import React, { useEffect, useState } from "react";
import { editPlayer } from "../../firebase/players.js";
import { useAuth } from "../../context/AuthContext";

export default function EditPlayerModal({ open, player = {}, onClose, onSuccess }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", tournament: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      name: player.name || "",
      tournament: player.tournament || "",
    });
    setFile(null);
    setLoading(false);
  }, [player, open]);

  if (!open) return null;

  const handleSave = async () => {
    try {
      setLoading(true);
      await editPlayer({ ...player, ...form, file });
      onSuccess && onSuccess();
      onClose();
    } catch (e) {
      alert("Failed to update player");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-xl font-semibold mb-4">Edit Player</h3>

        <label className="block text-sm font-medium">Name</label>
        <input
          className="w-full mb-3 p-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label className="block text-sm font-medium">Tournament</label>
        <input
          className="w-full mb-3 p-2 border rounded"
          value={form.tournament}
          onChange={(e) => setForm({ ...form, tournament: e.target.value })}
        />

        <div className="mb-3">
          <label className="block text-sm font-medium">Replace Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
