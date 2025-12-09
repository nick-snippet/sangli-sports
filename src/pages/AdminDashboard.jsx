import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // 🧠 Handle file upload (mock)
  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    // For now just simulate upload success
    setTimeout(() => {
      setMessage(`✅ ${file.name} uploaded successfully!`);
      setFile(null);
    }, 1000);
  };

  // 🚫 Redirect if not admin
  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-2xl font-bold text-red-600 mb-3">
          Access Denied
        </h2>
        <p className="text-gray-700 mb-4">
          You don’t have permission to view this page.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-white to-green-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-700">
            Admin Dashboard
          </h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Upload Section */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Upload Gallery Images
        </h2>
        <form
          onSubmit={handleUpload}
          className="border border-gray-300 rounded-lg p-6 bg-gray-50"
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full mb-4 p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Upload
          </button>
        </form>

        {/* Upload message */}
        {message && (
          <p className="mt-4 text-green-700 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
