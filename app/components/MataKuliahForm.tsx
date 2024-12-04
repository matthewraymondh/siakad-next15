"use client"; // Mark this as a client component

import { useState, useEffect } from "react";

type MataKuliah = {
  id: number;
  kodeMk: string;
  namaMk: string;
  sks: number;
};

const MataKuliahForm = () => {
  const [formData, setFormData] = useState({
    kodeMk: "",
    namaMk: "",
    sks: "",
  });

  const [mataKuliahList, setMataKuliahList] = useState<MataKuliah[]>([]);

  // Fetch MataKuliah data when the component is mounted
  useEffect(() => {
    const fetchMataKuliahData = async () => {
      const response = await fetch("/api/mataKuliah");
      const data = await response.json();
      setMataKuliahList(data.mataKuliah);
    };

    fetchMataKuliahData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newCourse = {
      kodeMk: formData.kodeMk,
      namaMk: formData.namaMk,
      sks: parseInt(formData.sks),
    };

    const response = await fetch("/api/mataKuliah", {
      method: "POST", // Send POST request to add the new course
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCourse),
    });

    const result = await response.json();

    if (response.ok) {
      setFormData({ kodeMk: "", namaMk: "", sks: "" });

      // Fetch updated list of MataKuliah after adding a new course
      const updatedListResponse = await fetch("/api/mataKuliah");
      const updatedListData = await updatedListResponse.json();
      setMataKuliahList(updatedListData.mataKuliah);
      alert(result.message);
    } else {
      alert(result.message || "Failed to add course");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Input Mata Kuliah</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Kode MK</label>
        <input
          type="text"
          value={formData.kodeMk}
          onChange={(e) => setFormData({ ...formData, kodeMk: e.target.value })}
          className="block w-full p-2 mb-4 border rounded-lg"
        />
        <label className="block mb-2 font-medium">Nama MK</label>
        <input
          type="text"
          value={formData.namaMk}
          onChange={(e) => setFormData({ ...formData, namaMk: e.target.value })}
          className="block w-full p-2 mb-4 border rounded-lg"
        />
        <label className="block mb-2 font-medium">SKS</label>
        <input
          type="number"
          value={formData.sks}
          onChange={(e) => setFormData({ ...formData, sks: e.target.value })}
          className="block w-full p-2 mb-4 border rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
        >
          Add Mata Kuliah
        </button>
      </form>

      {/* Display the list of MataKuliah below the form */}
      <h3 className="text-xl font-semibold mt-6">List of Mata Kuliah</h3>
      {mataKuliahList.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border border-gray-200 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3">Kode MK</th>
              <th className="border p-3">Nama MK</th>
              <th className="border p-3">SKS</th>
            </tr>
          </thead>
          <tbody>
            {mataKuliahList.map((mataKuliah) => (
              <tr key={mataKuliah.id}>
                <td className="border p-3">{mataKuliah.kodeMk}</td>
                <td className="border p-3">{mataKuliah.namaMk}</td>
                <td className="border p-3">{mataKuliah.sks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
};

export default MataKuliahForm;
