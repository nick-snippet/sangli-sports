import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[var(--primary)] text-gray-900 mt-10 py-8">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="font-semibold">© {new Date().getFullYear()} Sumeet Sports Cricket Academy</p>
        <p className="text-sm text-gray-700 mt-2">Sangli, Maharashtra • info@sumeetsportsacademy.com</p>

        <div className="mt-4 flex justify-center gap-4">
          <Link to="#" className="hover:text-green-700">📸</Link>
          <Link to="#" className="hover:text-green-700">📘</Link>
          <Link to="#" className="hover:text-green-700">🐦</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
