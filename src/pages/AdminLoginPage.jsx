// src/pages/AdminLoginPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminLoginPage() {
  const { user, login, logout } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  if (user?.role === "admin") {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
        <h2 className="text-3xl font-bold mb-4">Welcome Admin 👋</h2>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-3"
        >
          Logout
        </button>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError("Invalid credentials. Try again.");
    }
  }

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>
        {error && <p className="text-red-600 text-center mb-2">{error}</p>}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Admin Email"
            className="border p-2 rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            className="bg-[#0f2547] text-white py-2 rounded hover:bg-[#1b396a]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
