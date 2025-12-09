import React from "react";
import { motion } from "framer-motion";

export default function AwardPlayerCard({ name, tournament, image, isAdmin }) {
  // Normalize tournament input:
  // - If string with commas → convert to bullet lines
  // - If string with \n → show as new lines
  // - If array → use as bullets
  let tournamentLines = [];

  if (Array.isArray(tournament)) {
    tournamentLines = tournament;
  } else if (typeof tournament === "string") {
    if (tournament.includes("\n")) {
      tournamentLines = tournament.split("\n");
    } else if (tournament.includes(",")) {
      tournamentLines = tournament.split(",").map((t) => t.trim());
    } else {
      tournamentLines = [tournament];
    }
  }

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white/20 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-xl overflow-hidden p-9 text-center shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
    >

      {/* 🥇 Proud Player Badge */}
      <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
        🥇 Proud Player
      </div>

      {/* Player Image */}
      <div className="w-full h-80 rounded-2xl overflow-hidden mb-4">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Name */}
      <h3 className="text-lg font-bold text-[#03070e]">{name}</h3>

      {/* Tournament Achievements */}
      {tournamentLines.length > 1 ? (
        <ul className="mt-3 text-left list-disc text-gray-800 px-4 space-y-1 text-sm">
          {tournamentLines.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-800 mt-1">{tournamentLines[0]}</p>
      )}

      {/* Admin Buttons (same as before) */}
     {isAdmin && (
  <div className="mt-4 flex justify-center gap-3">
    <button
      onClick={onEdit}
      className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm shadow hover:scale-105 transition"
    >
      Edit
    </button>

    <button
      onClick={onReplaceImage}
      className="px-5 py-2 bg-purple-600 text-white rounded-full text-sm shadow hover:scale-105 transition"
    >
      Replace Image
    </button>

    <button
      onClick={onDelete}
      className="px-4 py-2 bg-red-600 text-white rounded-full text-sm shadow hover:scale-105 transition"
    >
      Delete
    </button>
  </div>
)}



    </motion.div>
  );
}
