"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    password: "",
    confirm: "",
    is_doctor: false,
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://127.0.0.1:8000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: form.username,
        email: form.email,
        password: form.password,
        is_doctor: false,
      }),
    });

    const data = await res.json();

 if (res.ok) {
  console.log("SUCCESS:", data);

  setMessage("Registration successful");

  setTimeout(() => {
    router.push("/login");
  }, 1500);
} else {
  setMessage(data.detail || "Registration failed");
}

} catch (err) {
    console.log("FETCH ERROR:", err);
    alert("Server not reachable");
}
};

  return (
  <main className="min-h-screen flex items-center justify-center transparent p-6">

    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">

      {/* LEFT SIDE - FORM */}
      <div className="p-10 flex flex-col justify-center">

        <h2 className="text-3xl font-bold mb-6">
          Create Your Account
        </h2>

        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${
              message.toLowerCase().includes("success")
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <input
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />

          <input
            type="password"
            name="confirm"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_doctor"
              checked={form.is_doctor}
              onChange={handleChange}
            />
            Register as Doctor
          </label>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 transition"
          >
            Create Account
          </button>

        </form>

        <p className="mt-6 text-sm text-center">
          Already registered?{" "}
          <Link href="/login" className="text-teal-600 font-medium">
            Login
          </Link>
        </p>

      </div>

      {/* RIGHT SIDE - IMAGE */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-teal-400 to-green-500">

        <img
          src="/doctor2.png"
          alt="doctor"
          className="w-3/4"
        />

      </div>

    </div>

  </main>
);
}
