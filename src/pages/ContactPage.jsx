import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-sky-200">

      {/* PAGE WRAPPER */}
      <section className="max-w-4xl mx-auto px-6 py-20">

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl md:text-5xl font-extrabold text-center text-[#0f2547] mb-10"
        >
          Contact Us
        </motion.h1>

        {/* CARD CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-sky-300 rounded-3xl shadow-xl p-10 border border-gray-100"
        >
          {/* LOCATION */}
          <p className="text-lg text-gray-700 mb-4">
            <b className="text-[#0f2547]">📍 Location:</b><br />
            Appasaheb Birnale Public School, Sangli, Maharashtra
          </p>

          {/* RESIDENTIAL */}
          <p className="text-lg text-gray-700 mb-4">
            <b className="text-[#0f2547]">🏡 Residential Facility:</b><br />
            Appasaheb Birnale Public School Boys Hostel
          </p>

          {/* PHONE NUMBERS */}
          <div className="mt-6 space-y-2">
            <p className="text-lg text-gray-800 font-semibold">
              📞 +91 9403230200
            </p>
            <p className="text-lg text-gray-800 font-semibold">
              📞 +91 7507878219
            </p>
          </div>

          {/* EMAIL */}
          <p className="text-lg text-gray-600 mt-6">
            ✉️ info@sumeetsportsacademy.com
          </p>

          {/* BACK BUTTON */}
          <div className="mt-10 text-center">
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-sky-500 to-pink-500 
                         text-gray rounded-full shadow-md font-semibold hover:scale-105 transition"
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}