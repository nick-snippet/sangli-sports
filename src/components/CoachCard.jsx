// src/components/CoachCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaLinkedin, FaGlobe } from "react-icons/fa";

export default function CoachCard({
  name,
  title,
  description,
  details,
  image,
  instagram,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-sky-100 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row-reverse md:items-center gap-8"
    >
      {/* IMAGE — RIGHT ON DESKTOP / TOP ON MOBILE */}
      <div className="w-full md:w-1/4 flex justify-top md:justify-end">
        <img
          src={image}
          alt={name}
          className="w-52 h-60 md:w-78 md:h-96 object-cover rounded-2xl shadow-lg"
        />
      </div>

      {/* TEXT AREA */}
      <div className="w-full md:w-3/4 text-gray-800">
        <h2 className="text-3xl font-extrabold text-[#0f2547] mb-1">{name}</h2>
        <p className="text-sm font-medium text-gray-600 mb-4">{title}</p>

        {/* Separator */}
        <div className="h-[2px] bg-gradient-to-r from-pink-400 to-sky-400 w-24 mb-4 rounded-full"></div>

        {/* MAIN DETAILS */}
        <div className="space-y-3 text-[15px] leading-relaxed">
          {/* Summary Points (bullets + emojis) */}
          <ul className="list-disc pl-5 space-y-1">
            {details?.map((item, idx) => (
              <li key={idx} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>

          {/* QUOTE */} 
          {description && (
            <p className="italic text-gray-700 border-l-4 border-pink-400 pl-4 mt-4">
              “{description}”
            </p>
          )}

          {/* SOCIAL ICONS – NOW OPEN LINKS */}
          <div className="flex gap-4 mt-4">
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center hover:scale-110 transition"
              >
                <FaInstagram className="text-white" />
              </a>
            )}

          
          </div>

          <p className="text-gray-800 text-[15px] leading-relaxed"></p>
        </div>
      </div>
    </motion.div>
  );
} 