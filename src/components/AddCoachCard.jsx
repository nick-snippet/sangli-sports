import React from "react";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";

export default function AddCoachCard({ onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className="bg-sky-100 cursor-pointer hover:bg-sky-200/80 backdrop-blur-xl 
                 border border-white/60 rounded-3xl shadow-2xl p-6 md:p-10 
                 flex flex-col items-center justify-center gap-6 transition"
    >
      {/* Plus Icon */}
      <div className="w-32 h-40 md:w-44 md:h-64 flex items-center justify-center 
                      border-2 border-dashed border-gray-400 rounded-2xl">
        <FiPlus className="text-gray-500" size={60} />
      </div>

      {/* Text */}
      <p className="text-lg font-semibold text-gray-700 text-center">
        Add New Coach
      </p>
    </motion.div>
  );
}