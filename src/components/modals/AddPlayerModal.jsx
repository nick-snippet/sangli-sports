// src/components/modals/AddPlayerModal.jsx
import React, { useState } from "react";
import { addPlayer } from "../../firebase/players.js";

export default function AddPlayerModal({ open, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [tournament, setTournament] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  if (!open) return null;

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      setErr("⚠️ Please upload a JPG/PNG image.");
      return;
    }
    setErr("");
    setFile(f);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !tournament || !file) return setErr("⚠️ All fields required.");

    setLoading(true);
    setErr("");
    try {
      await addPlayer({ name, tournament, file });
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      setErr(error.message || "Upload failed");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-semibold mb-3">Add New Player</h3>
        {err && <div className="text-sm text-red-600 mb-2">{err}</div>}

        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full p-2 border rounded"
            placeholder="Player name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-2 border rounded"
            placeholder="Tournament details"
            value={tournament}
            onChange={(e) => setTournament(e.target.value)}
          />

          <label className="block">
            <p className="text-sm font-medium mb-1">Player Image</p>
            <label
              htmlFor="playerFile"
              className="px-4 py-2 bg-pink-600 text-white rounded cursor-pointer hover:bg-pink-700 inline-block"
            >
              📤 Upload
            </label>
            <input
              id="playerFile"
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
            {file && <p className="mt-2 text-sm">Selected: {file.name}</p>}
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#0f2547] text-white rounded"
            >
              {loading ? "Uploading..." : "Add Player"}
            </button>
            <button onClick={onClose} type="button" className="px-4 py-2 border rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
