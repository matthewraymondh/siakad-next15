"use client"; // Mark this as a client component

import { useState, useEffect } from "react";

type Mahasiswa = {
  nim: string;
  nama: string;
  ipk: string;
  sksMax: string;
  krs: { mataKuliahId: number }[];
};

type MataKuliah = {
  id: number;
  kodeMk: string;
  namaMk: string;
  sks: number;
};

const Form = () => {
  const [formData, setFormData] = useState<Mahasiswa>({
    nim: "",
    nama: "",
    ipk: "",
    sksMax: "",
    krs: [],
  });

  const [mataKuliahList, setMataKuliahList] = useState<MataKuliah[]>([]);

  useEffect(() => {
    // Fetch available MataKuliah (courses) from the server
    const fetchMataKuliah = async () => {
      const response = await fetch("/api/mataKuliah");
      const data = await response.json();
      setMataKuliahList(data.mataKuliah);
    };
    fetchMataKuliah();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/mahasiswa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      setFormData({
        nim: "",
        nama: "",
        ipk: "",
        sksMax: "",
        krs: [],
      });
    } else {
      alert(result.message);
    }
  };

  const handleCheckboxChange = (id: number) => {
    setFormData((prev) => {
      const isChecked = prev.krs.some((item) => item.mataKuliahId === id);
      const newKrs = isChecked
        ? prev.krs.filter((item) => item.mataKuliahId !== id)
        : [...prev.krs, { mataKuliahId: id }];

      return { ...prev, krs: newKrs };
    });
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Input Mahasiswa</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <label className="block mb-2 font-medium">NIM</label>
        <input
          type="text"
          value={formData.nim}
          onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
          className="block w-full p-2 mb-4 border rounded-lg"
          required
        />

        <label className="block mb-2 font-medium">Nama</label>
        <input
          type="text"
          value={formData.nama}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          className="block w-full p-2 mb-4 border rounded-lg"
          required
        />

        <label className="block mb-2 font-medium">IPK</label>
        <input
          type="number"
          step="0.01"
          value={formData.ipk}
          onChange={(e) => setFormData({ ...formData, ipk: e.target.value })}
          className="block w-full p-2 mb-4 border rounded-lg"
          required
        />

        <label className="block mb-2 font-medium">SKS Max</label>
        <input
          type="number"
          value={formData.sksMax}
          onChange={(e) => setFormData({ ...formData, sksMax: e.target.value })}
          className="block w-full p-2 mb-4 border rounded-lg"
          required
        />

        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Mata Kuliah (Courses)
          </label>
          {mataKuliahList.map((mataKuliah) => (
            <div key={mataKuliah.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={formData.krs.some(
                  (krs) => krs.mataKuliahId === mataKuliah.id
                )}
                onChange={() => handleCheckboxChange(mataKuliah.id)}
                className="mr-2"
              />
              <span>
                {mataKuliah.namaMk} ({mataKuliah.sks} SKS)
              </span>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
        >
          Simpan
        </button>
      </form>
    </div>
  );
};

export default Form;
