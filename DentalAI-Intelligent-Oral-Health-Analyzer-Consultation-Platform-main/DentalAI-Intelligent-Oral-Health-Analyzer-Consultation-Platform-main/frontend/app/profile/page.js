"use client";

import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);

  // 🔹 Fetch user data
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("http://127.0.0.1:8000/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm(data);
      });
  }, []);

  // 🔹 Handle input change
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // 🔹 Save profile
  async function saveProfile() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/auth/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Profile updated");
      setUser(form);
      setEditing(false);
    } else {
      alert("Update failed");
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }

  const initials = user.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").toUpperCase()
    : user.username[0].toUpperCase();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-6">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow">
            {initials}
          </div>

          <h2 className="mt-3 text-xl font-semibold">
            {user.full_name || user.username}
          </h2>

          <span className={`mt-1 px-3 py-1 text-xs rounded-full ${
            user.is_doctor
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}>
            {user.is_doctor ? "Doctor" : "User"}
          </span>
        </div>

        {/* Editable Details */}
        <div className="space-y-3 text-sm">

          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-500">Username</span>
            <span className="font-medium">{user.username}</span>
          </div>

          <input
            name="full_name"
            value={form.full_name || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Full Name"
            className="w-full border p-2 rounded"
          />

          <input
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Email"
            className="w-full border p-2 rounded"
          />

          <input
            name="age"
            value={form.age || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Age"
            className="w-full border p-2 rounded"
          />

          <input
            name="gender"
            value={form.gender || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Gender"
            className="w-full border p-2 rounded"
          />

          <input
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Phone"
            className="w-full border p-2 rounded"
          />

          <input
            name="address"
            value={form.address || ""}
            onChange={handleChange}
            disabled={!editing}
            placeholder="Address"
            className="w-full border p-2 rounded"
          />

        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:opacity-90"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={saveProfile}
                className="w-full py-2 rounded-lg bg-green-500 text-white font-medium"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setEditing(false);
                  setForm(user);
                }}
                className="w-full py-2 rounded-lg bg-gray-400 text-white font-medium"
              >
                Cancel
              </button>
            </>
          )}

        </div>

      </div>
    </main>
  );
}