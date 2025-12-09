// src/pages/AdminGate.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminGate() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);

      // Give Firebase time to refresh token/claims
      setTimeout(() => navigate("/"), 300);

    } catch (err) {
      console.error("Admin login failed:", err);
      alert("Invalid admin email or password");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 to-pink-200 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 border border-gray-200">

        <h2 className="text-3xl text-center font-bold mb-2 text-[#0f2547]">
          Admin Login
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Enter admin credentials to access dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-gray-800 text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sumeetsports.com"
              className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring focus:ring-sky-200"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-800 text-sm font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring focus:ring-sky-200"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0f2547] text-white rounded-lg font-semibold hover:bg-[#1b396a] transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
}
