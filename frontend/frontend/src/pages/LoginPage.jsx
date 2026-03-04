import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://car-lease-loan-ai-assistant.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      // if (data.success) {
      //   // SAVE TOKEN & USER
      //   localStorage.setItem("token", data.token);
      //   localStorage.setItem("user", JSON.stringify(data.user));

      //   toast.success("Welcome back!");
      //   navigate("/"); // Redirect to Dashboard
      // }
      // inside handleLogin function...
      if (data.success) {
        // 👇 CHANGE THIS: Use sessionStorage
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        toast.success("Welcome back!");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Server Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email" // 👈 ADD THIS
              className="w-full border border-gray-300 rounded-lg p-3 mt-1"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password" // 👈 ADD THIS (Fixes the warning)
              className="w-full border border-gray-300 rounded-lg p-3 mt-1"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          New here?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-bold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
