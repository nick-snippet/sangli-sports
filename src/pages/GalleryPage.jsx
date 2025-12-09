import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function GalleryPage() {
  const { user } = useAuth();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6 },
    }),
  };

  // Sample gallery events (replace with backend data)
  const gallerySections = [
    {
      
      title: "Maharashtra Premier League Selections",
      desc: "Our academy players giving their best in the MPL selection trials with dedication and sportsmanship.",
      images: [
        "/images/GLphotos/mpl1.jpeg",
        "/images/GLphotos/mpl2.jpeg",
        "/images/GLphotos/mpl3.jpeg",
        "/images/GLphotos/mpl4.jpeg",
      ],
    },
    {
      title: "Women’s Cricket Empowerment Camp",
      desc: "Focused on enhancing skills and confidence of our women cricketers through specialized coaching sessions.",
      images: [
        "/images/women1.jpeg",
        "/images/women2.jpeg",
        "/images/women3.jpeg",
      ],
    },
    {
      title: "Annual Trophy Tournament 2025",
      desc: "Celebrating team spirit and performance at our annual cricket tournament held at Sangli ground.",
      images: [
        "/images/fitness.jpeg",
         "/images/GLphotos/trophy3.jpeg",
        "/images/team.jpeg",
        "/images/GLphotos/trophy2.jpeg",
        
      ],
    },
    {
      title: "Junior Cricket Summer Camp",
      desc: "A training camp to shape young players with technical drills, fun matches, and motivational sessions.",
      images: [
        "./images/camp1.jpeg",
        "./images/camp2.jpeg",
        "./images/camp3.jpeg",
      ],
    },
  ];
    const [filter, setFilter] = React.useState('All');
  return (
    <div className="min-h-screen bg-sky-300 text-gray-900">
      {/* HEADER SECTION */}
      <section className="relative py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold text-[#0f2547]"
        >
          Gallery Highlights
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-3 text-gray-600 max-w-2xl mx-auto"
        >
          Moments that define our academy — passion, teamwork, and excellence captured in every frame.
        </motion.p>

        {/* Admin upload button */}
        {user?.role === "admin" && (
          <div className="mt-6">
            <Link
              to="/upload?type=gallery"
              className="px-6 py-2 bg-gradient-to-r from-sky-500 to-pink-500 text-white rounded-full font-semibold shadow-md hover:scale-105 transition"
            >
              Upload New Event
            </Link>
          </div>
        )}
      </section>

      {/* EVENT SECTIONS */}
      <div className="max-w-7xl mx-auto px-6 space-y-16 pb-20">
        {gallerySections.map((event, index) => (
          <motion.section
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="bg-white rounded-3xl shadow-lg p-8 md:p-10"
          >
            {/* Event Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#0f2547] mb-3">
                {event.title}
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {event.desc}
              </p>
            </motion.div>

            {/* Event Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {event.images.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <img
                    src={img}
                    alt={`Event ${index + 1} - ${i + 1}`}
                    className="w-full h-56 object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="bg-[#0b1020] text-gray-300 rounded-t-[40px] pt-12">
        <div className="max-w-6xl mx-auto px-6 pb-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img
              src="/images/logo.jpeg"
              alt="Sumeet Sports"
              className="w-20 h-20 rounded-full mb-3 border border-gray-400"
            />
            <p className="text-sm">
              Sumeet Sports Cricket Academy — Sangli, Maharashtra
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-white">Contact</h4>
            <p className="text-sm">info@sumeetsportsacademy.com</p>
            <p className="text-sm">+91 9876543210</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-white">Quick Links</h4>
            <ul className="text-sm space-y-2">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:underline">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-white">Follow Us</h4>
            <div className="flex gap-3">
              {["Fb", "In", "Ig"].map((icon, i) => (
                <a
                  key={i}
                  className="w-9 h-9 rounded-full bg-orange-300 flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-500 hover:to-sky-500 transition text-sm font-semibold"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-sm">
          © {new Date().getFullYear()} Sumeet Sports Cricket Academy — All rights reserved.
        </div>
      </footer>
    </div>
  );
}