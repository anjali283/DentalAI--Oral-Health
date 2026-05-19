"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Login() {
   const router = useRouter();  
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError("");
  }

 async function handleSubmit(e) {
  e.preventDefault();

  if (!form.username || !form.password) {
    setError("Please enter email and password.");
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: form.username,
        password: form.password,
      }),
    });

    if (!res.ok) throw new Error();

    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    window.dispatchEvent(new Event("login"));
    router.push("/");
  } catch {
    setError("Invalid credentials");
  }
}


  return (
  <main className="min-h-screen flex items-center justify-center bg-transparent p-6">

    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">

      {/* LEFT SIDE - FORM */}
      <div className="p-10 flex flex-col justify-center">

        <h2 className="text-3xl font-bold mb-6">
          Login To Your Account!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}

          {/* Email */}
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="absolute right-3 top-3 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Options */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember Me
            </label>

            <Link href="/forgot" className="text-teal-600">
              Forgot Password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-teal-500 text-white font-semibold hover:bg-teal-600 transition"
          >
            Login
          </button>

        </form>

        <p className="mt-6 text-sm text-center">
          Not Registered Yet?{" "}
          <Link href="/register" className="text-teal-600 font-medium">
            Sign-Up
          </Link>
        </p>

      </div>

      {/* RIGHT SIDE - ILLUSTRATION */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-teal-400 to-green-500">

        <img
          src="/doctor.png"
          alt="doctor"
          className="w-3/4"
        />

      </div>

    </div>

  </main>
);
}