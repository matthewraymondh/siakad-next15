// app/create-user/page.tsx

"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function CreateUser() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        requesterRole: user?.role, // Include role of the logged-in user
      }),
    });

    const result = await response.json();
    if (response.ok) {
      setMessage(result.message);
      setFormData({ username: "", password: "", role: "user" });
    } else {
      setMessage(result.message || "Error creating user");
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Create User</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <label className="block mb-2 font-medium">Username</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className="block w-full p-2 mb-4 border rounded-lg"
        />
        <label className="block mb-2 font-medium">Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="block w-full p-2 mb-4 border rounded-lg"
        />
        <label className="block mb-2 font-medium">Role</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="block w-full p-2 mb-4 border rounded-lg"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Create User
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}
