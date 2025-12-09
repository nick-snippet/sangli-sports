import React, { useEffect, useState } from "react"; 
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const heroImages = [
    "/images/hero1.jpeg",
    "/images/hero2.jpeg",
    "/images/hero.jpeg",
    "/images/academy.jpeg",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section
      className="
        relative
        h-screen
        pt-32        /* Pull hero behind transparent navbar */
        w-full
        overflow-hidden
        flex
        items-center
        justify-center
      "
    >
      {/* IMAGE SLIDES */}
      {heroImages.map((img, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 bg-cover bg-center"
          initial={{ opacity: 0 }}
          animate={{
            opacity: index === current ? 1 : 0,
            scale: index === current ? 1.15 : 1,
          }}
          transition={{ duration: 1.8 }}
          style={{
            backgroundImage: `url(${img})`,
            backgroundRepeat: "no-repeat",
          }}
        />
      ))}

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/10" />

      {/* TEXT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-20 text-center px-6 max-w-3xl"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-2xl">
          Train Hard ,Play Smart.
        </h1>

        <p className="mt-4 text-lg md:text-2xl text-white drop-shadow-lg">
          Grow like a champion — Unlock your true cricketing potential.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">

  {/* Learn More → scroll to about-section */}
  <button
    onClick={() => {
      document.getElementById("about-section")?.scrollIntoView({
        behavior: "smooth",
      });
    }}
    className="
      px-6 py-3 rounded-full
      bg-gradient-to-r from-sky-500 to-pink-500
      text-white shadow-lg
      hover:scale-105 transition
    "
  >
    Learn More
  </button>

  {/* Contact Us → already correct */}
  <a
    href="#contact-section"
    className="
      px-6 py-3 rounded-full
      border border-gray-300
      text-black hover:bg-gray-50 transition
    "
  >
    Contact Us
  </a>

</div>

      </motion.div>

      {/* FADE TO WHITE BOTTOM */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
