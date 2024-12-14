"use client"; // Mark this as a client component

import { useState, useEffect } from "react";
import { toast } from "sonner";

type MataKuliah = {
  id: number;
  kodeMk: string;
  namaMk: string;
  sks: number;
  ruangan: string;
};

const MataKuliahForm = () => {
  const [formData, setFormData] = useState({
    id: null, // Used for editing
    kodeMk: "",
    namaMk: "",
    sks: "",
    ruangan: "",
  });

  const [mataKuliahList, setMataKuliahList] = useState<MataKuliah[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);

  // Fetch MataKuliah data when the component is mounted
  const fetchMataKuliahData = async () => {
    try {
      const response = await fetch("/api/mataKuliah");
      const data = await response.json();
      setMataKuliahList(data.mataKuliah);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses. Please try again.");
    }
  };

  useEffect(() => {
    fetchMataKuliahData();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    const courseData = {
      kodeMk: formData.kodeMk,
      namaMk: formData.namaMk,
      sks: parseInt(formData.sks),
      ruangan: formData.ruangan,
    };

    try {
      const response = await fetch("/api/mataKuliah", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Course added successfully!");
        fetchMataKuliahData();
        setFormData({ id: null, kodeMk: "", namaMk: "", sks: "", ruangan: "" });
      } else {
        toast.error(result.message || "Failed to add course.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "An error occurred while adding the course. Please try again."
      );
    }
  };

  const openEditModal = (mataKuliah: MataKuliah) => {
    setFormData({
      id: mataKuliah.id,
      kodeMk: mataKuliah.kodeMk,
      namaMk: mataKuliah.namaMk,
      sks: mataKuliah.sks.toString(),
      ruangan: mataKuliah.ruangan,
    });
    setIsEditing(true);
    setEditModal(true);
  };

  const closeEditModal = () => {
    setFormData({ id: null, kodeMk: "", namaMk: "", sks: "", ruangan: "" });
    setIsEditing(false);
    setEditModal(false);
  };

  const handleEditCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id) return;

    const courseData = {
      kodeMk: formData.kodeMk,
      namaMk: formData.namaMk,
      sks: parseInt(formData.sks),
      ruangan: formData.ruangan,
    };

    try {
      const response = await fetch(`/api/mataKuliah/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Course updated successfully!");
        fetchMataKuliahData();
        closeEditModal();
      } else {
        toast.error(result.message || "Failed to update course.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "An error occurred while updating the course. Please try again."
      );
    }
  };

  const openDeleteModal = (id: number) => {
    setCourseToDelete(id);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setCourseToDelete(null);
  };

  const handleDeleteCourse = async () => {
    if (courseToDelete === null) return;

    try {
      const response = await fetch(`/api/mataKuliah/${courseToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Course deleted successfully!");
        fetchMataKuliahData();
        closeDeleteModal();
      } else {
        toast.error("Failed to delete course.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "An error occurred while deleting the course. Please try again."
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Input Mata Kuliah</h2>
      <form onSubmit={handleAddCourse}>
        <label className="block mb-2 font-medium">Kode MK</label>
        <input
          type="text"
          name="kodeMk"
          value={formData.kodeMk}
          onChange={handleFormChange}
          className="block w-full p-2 mb-4 border rounded-lg"
          required
        />
        <label className="block mb-2 font-medium">Nama MK</label>
        <input
          type="text"
          name="namaMk"
          value={formData.namaMk}
          onChange={handleFormChange}
          className="block w-full p-2 mb-4 border rounded-lg"
          required
        />
        <label className="block mb-2 font-medium">SKS</label>
        <input
          type="number"
          name="sks"
          value={formData.sks}
          onChange={handleFormChange}
          className="block w-full p-2 mb-4 border rounded-lg"
          required
        />
        <label className="block mb-2 font-medium">Ruangan</label>
        <input
          type="text"
          name="ruangan"
          value={formData.ruangan}
          onChange={handleFormChange}
          className="block w-full p-2 mb-4 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
        >
          Add Mata Kuliah
        </button>
      </form>

      <h3 className="text-xl font-semibold mt-6">List of Mata Kuliah</h3>
      {mataKuliahList.length > 0 ? (
        <div className="overflow-y-auto max-h-64 border border-gray-300 rounded-md">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3">Kode MK</th>
                <th className="border p-3">Nama MK</th>
                <th className="border p-3">SKS</th>
                <th className="border p-3">Ruangan</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mataKuliahList.map((mataKuliah) => (
                <tr key={mataKuliah.id}>
                  <td className="border p-3">{mataKuliah.kodeMk}</td>
                  <td className="border p-3">{mataKuliah.namaMk}</td>
                  <td className="border p-3">{mataKuliah.sks}</td>
                  <td className="border p-3">{mataKuliah.ruangan}</td>
                  <td className="border p-3 flex gap-2">
                    <button
                      onClick={() => openEditModal(mataKuliah)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(mataKuliah.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No courses available.</p>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h4 className="text-lg font-semibold mb-4">Edit Mata Kuliah</h4>
            <form onSubmit={handleEditCourse}>
              <label className="block mb-2 font-medium">Kode MK</label>
              <input
                type="text"
                name="kodeMk"
                value={formData.kodeMk}
                onChange={handleFormChange}
                className="block w-full p-2 mb-4 border rounded-lg"
                required
              />
              <label className="block mb-2 font-medium">Nama MK</label>
              <input
                type="text"
                name="namaMk"
                value={formData.namaMk}
                onChange={handleFormChange}
                className="block w-full p-2 mb-4 border rounded-lg"
                required
              />
              <label className="block mb-2 font-medium">SKS</label>
              <input
                type="number"
                name="sks"
                value={formData.sks}
                onChange={handleFormChange}
                className="block w-full p-2 mb-4 border rounded-lg"
                required
              />
              <label className="block mb-2 font-medium">Ruangan</label>
              <input
                type="text"
                name="ruangan"
                value={formData.ruangan}
                onChange={handleFormChange}
                className="block w-full p-2 mb-4 border rounded-lg"
                required
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h4 className="text-lg font-semibold mb-4">Delete Mata Kuliah</h4>
            <p>Are you sure you want to delete this course?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCourse}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MataKuliahForm;
