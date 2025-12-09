// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";

// 🔥 NEW — AuthContext import
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home-section");

  // 🔥 NEW — Access admin user + logout
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Home", id: "home-section" },
    { label: "About", id: "about-section" },
    { label: "Programs", id: "programs-section" },
    { label: "Gallery", id: "gallery-section" },
    { label: "Shop", id: "shop-section" },
    { label: "Contact", id: "contact-section" },
  ];

  const scrollToSection = (id) => {
    setOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 350);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    const sections = navItems.map((n) => document.getElementById(n.id)).filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length) {
        visible.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        setActiveSection(visible[0].target.id);
      }
    }, observerOptions);

    sections.forEach((s) => observer.observe(s));
    return () => sections.forEach((s) => observer.unobserve(s));
  }, [location.pathname]);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 pointer-events-auto transition-all duration-300
        ${scrolled ? "backdrop-blur-xl bg-white/40 shadow-md" : "backdrop-blur-lg bg-white/30 shadow-sm"}
      `}
    >
      <div className="pt-4 md:pt-4"></div>

      <div className="max-w-8xl mx-auto relative flex items-center justify-between pl-0 md:pl-0 pr-4 md:pr-6">

        {/* LEFT LOGO + TITLE */}
        <Link
          to="/"
          className="pointer-events-auto flex items-center gap-3 select-none"
          onClick={() => scrollToSection("home-section")}
        >
          <img
            src="/images/logobg.png"
            className="h-14 w-14 md:h-25 md:w-25 rounded-2xl shadow-md object-cover"
            alt="logo"
          />
          <div className="flex flex-col leading-[1.1]">
            <span className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-sky-600 to-pink-500 bg-clip-text text-transparent">
              SUMEET
            </span>
            <span className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-sky-600 to-pink-500 bg-clip-text text-transparent">
              SPORTS
            </span>
          </div>
        </Link>

        {/* CENTER NAV CAPSULE */}
        <motion.div
          initial={{ y: -14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className={`
            hidden md:flex absolute left-1/2 -translate-x-1/2 pointer-events-auto
            rounded-full px-6 py-3 backdrop-blur-2xl border border-white/60 shadow-lg
            bg-white/70 transition-all duration-300
            ${scrolled ? "bg-white/85 shadow-xl" : ""}
          `}
        >
          <div className="flex gap-6 font-semibold text-lg">
            {navItems.map((item, i) => (
              <button
                key={i}
                onClick={() => scrollToSection(item.id)}
                className={`
                  px-4 py-2 rounded-full transition-all
                  ${activeSection === item.id
                    ? "bg-gradient-to-r from-sky-500 to-pink-500 text-white shadow-md"
                    : "text-gray-700 hover:text-black"}
                `}
              >
                {item.label}
              </button>
            ))}

            {/* 🔥 NEW — Desktop Logout Button (admin only) */}
            {user?.role === "admin" && (
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Logout
              </button>
            )}
          </div>
        </motion.div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-black text-2xl pointer-events-auto"
          onClick={() => setOpen(!open)}
        >
          {open ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="
              md:hidden mt-4 mx-auto w-[92%] rounded-3xl bg-white/95
              backdrop-blur-xl border border-gray-200 p-4 text-center
              shadow-xl pointer-events-auto
            "
          >
            {navItems.map((item, i) => (
              <button
                key={i}
                onClick={() => scrollToSection(item.id)}
                className={`
                  block w-full py-3 text-lg font-semibold rounded-full transition mb-2
                  ${activeSection === item.id
                    ? "bg-gradient-to-r from-sky-500 to-pink-500 text-white shadow"
                    : "text-gray-700 hover:bg-gray-100"}
                `}
              >
                {item.label}
              </button>
            ))}

            {/* 🔥 NEW — Mobile Logout Button */} 
            {user?.role === "admin" && (
              <button
                onClick={logout}
                className="mt-2 w-full py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
