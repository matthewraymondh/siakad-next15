"use client"; // Mark this as a client component

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import the jsPDF AutoTable plugin
import Layout from "../page";
// import Link from "next/link"; // Import Link for navigation

// Types for Mahasiswa and MataKuliah
type MataKuliah = {
  id: number;
  kodeMk: string;
  namaMk: string;
  sks: number;
};

type Krs = {
  MataKuliah: MataKuliah;
};

type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  ipk: number;
  sksMax: number;
  krs: Krs[];
};

const Mahasiswa = () => {
  const [formData, setFormData] = useState({
    nim: "",
    nama: "",
    ipk: "",
    sksMax: "",
  });

  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [mataKuliahList, setMataKuliahList] = useState<MataKuliah[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<MataKuliah[]>([]); // Store selected courses
  const [totalSKS, setTotalSKS] = useState(0); // Track total SKS selected for the student
  const [remainingSKS, setRemainingSKS] = useState(0); // Track remaining SKS that can be added

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMahasiswaId, setEditingMahasiswaId] = useState<number | null>(
    null
  );

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [selectedMahasiswaForCourse, setSelectedMahasiswaForCourse] = useState<
    number | null
  >(null);

  // States for SKS modal
  const [isSksModalOpen, setIsSksModalOpen] = useState(false); // SKS modal visibility
  const [selectedMahasiswaForSks, setSelectedMahasiswaForSks] =
    useState<Mahasiswa | null>(null); // Selected mahasiswa for SKS modal

  useEffect(() => {
    // Fetch Mahasiswa data along with Krs (courses)
    const fetchMahasiswaData = async () => {
      const response = await fetch("/api/mahasiswa");
      const data = await response.json();
      setMahasiswaList(data.mahasiswa);
    };

    // Fetch MataKuliah (courses) data
    const fetchMataKuliahData = async () => {
      const response = await fetch("/api/mataKuliah");
      const data = await response.json();
      setMataKuliahList(data.mataKuliah);
    };

    fetchMahasiswaData();
    fetchMataKuliahData();
  }, []);

  // Create new Mahasiswa
  const handleSubmitMahasiswa = async (e: React.FormEvent) => {
    e.preventDefault();

    const ipk = parseFloat(formData.ipk);

    // Automatically determine SKS Max based on IPK
    const sksMax = ipk < 3 ? 20 : 24;

    const newMahasiswa = {
      nim: formData.nim,
      nama: formData.nama,
      ipk,
      sksMax,
    };

    const response = await fetch("/api/mahasiswa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMahasiswa),
    });

    const result = await response.json();

    if (response.ok) {
      setFormData({ nim: "", nama: "", ipk: "", sksMax: "" });
      setMahasiswaList((prev) => [...prev, result.mahasiswa]);
      alert(result.message);
    } else {
      alert(result.message || "Failed to add mahasiswa");
    }
  };

  // Update Mahasiswa
  const handleUpdateMahasiswa = async () => {
    if (editingMahasiswaId === null) return;

    const updatedData = {
      nim: formData.nim,
      nama: formData.nama,
      ipk: parseFloat(formData.ipk),
      sksMax: parseInt(formData.sksMax),
    };

    const response = await fetch(`/api/mahasiswa/${editingMahasiswaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Mahasiswa updated successfully!");
      setMahasiswaList((prev) =>
        prev.map((mahasiswa) =>
          mahasiswa.id === editingMahasiswaId
            ? { ...mahasiswa, ...updatedData }
            : mahasiswa
        )
      );
      closeModal();
    } else {
      alert(result.message || "Failed to update mahasiswa");
    }
  };

  // Delete Mahasiswa
  const handleDeleteMahasiswa = async (mahasiswaId: number) => {
    try {
      const response = await fetch(`/api/mahasiswa/${mahasiswaId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || "Mahasiswa deleted successfully!");
        setMahasiswaList((prev) =>
          prev.filter((mahasiswa) => mahasiswa.id !== mahasiswaId)
        );
      } else {
        const errorResult = await response.json();
        alert(errorResult.message || "Failed to delete mahasiswa");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting mahasiswa");
    }
  };

  // Add selected courses to Mahasiswa
  const handleSelectCourse = (course: MataKuliah) => {
    const courseExists = selectedCourses.some((c) => c.id === course.id);

    if (courseExists) {
      const updatedCourses = selectedCourses.filter((c) => c.id !== course.id);
      setSelectedCourses(updatedCourses);
      updateTotalSKS(updatedCourses);
    } else {
      const updatedCourses = [...selectedCourses, course];
      setSelectedCourses(updatedCourses);
      updateTotalSKS(updatedCourses);
    }
  };

  const updateTotalSKS = (updatedCourses: MataKuliah[]) => {
    const totalSKS = updatedCourses.reduce(
      (acc, course) => acc + course.sks,
      0
    );
    setTotalSKS(totalSKS);
    updateRemainingSKS(totalSKS);
  };

  // Calculate remaining SKS
  const updateRemainingSKS = (totalSKS: number) => {
    const maxSKS = selectedMahasiswaForCourse
      ? mahasiswaList.find((mhs) => mhs.id === selectedMahasiswaForCourse)
          ?.sksMax
      : 24; // Default max SKS
    setRemainingSKS(maxSKS! - totalSKS);
  };

  // Add courses to Mahasiswa
  const handleAddCoursesToMahasiswa = async (mahasiswaId: number) => {
    const mahasiswa = mahasiswaList.find((mhs) => mhs.id === mahasiswaId);
    if (!mahasiswa) return;

    // Filter out duplicate courses in the frontend
    const existingCourseIds = mahasiswa.krs.map((krs) => krs.MataKuliah.id);
    const uniqueCourses = selectedCourses.filter(
      (course) => !existingCourseIds.includes(course.id)
    );

    if (uniqueCourses.length === 0) {
      alert("All selected courses are already assigned to this student.");
      return;
    }

    const response = await fetch(`/api/mahasiswa/${mahasiswaId}/add-courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mataKuliahIds: uniqueCourses.map((course) => course.id),
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      setSelectedCourses([]);
      setTotalSKS(0);
      setRemainingSKS(0);
      setMahasiswaList((prev) =>
        prev.map((mhs) =>
          mhs.id === mahasiswaId
            ? {
                ...mhs,
                krs: [
                  ...mhs.krs,
                  ...uniqueCourses.map((course) => ({ MataKuliah: course })),
                ],
              }
            : mhs
        )
      );
      closeCourseModal();
    } else {
      alert(result.message || "Failed to add courses");
    }
  };

  // Generate Prettier KRS PDF
  const generateKRS = (mahasiswa: Mahasiswa) => {
    const doc = new jsPDF();

    // Set document margins and font
    const margin = 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);

    // Title of the document
    doc.setFontSize(18);
    doc.text(`Kartu Rencana Studi (KRS)`, margin, 20);
    doc.setFontSize(14);
    doc.text(`NIM: ${mahasiswa.nim}`, margin, 30);
    doc.text(`Nama: ${mahasiswa.nama}`, margin, 40);
    doc.text(`IPK: ${mahasiswa.ipk}`, margin, 50);
    doc.text(`SKS Max: ${mahasiswa.sksMax}`, margin, 60);

    let yOffset = 75; // Start position for the courses table

    // Draw a horizontal line for separation
    doc.setLineWidth(0.5);
    doc.line(margin, yOffset - 2, 200 - margin, yOffset - 2);

    // Table Header
    yOffset += 10;
    doc.setFontSize(12);
    doc.text("Courses", margin, yOffset);
    yOffset += 10;

    // Table Body using autoTable
    doc.autoTable({
      startY: yOffset,
      head: [["No.", "Course Name", "SKS"]],
      body: mahasiswa.krs.map((krs, index) => [
        index + 1,
        krs.MataKuliah.namaMk,
        krs.MataKuliah.sks,
      ]),
      margin: { left: margin, right: margin },
      theme: "grid", // Use grid style for the table
      styles: {
        fontSize: 12,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133], // Green color for header
        textColor: [255, 255, 255], // White text in header
        fontSize: 13,
        fontStyle: "bold",
        halign: "center", // Center align header
      },
      bodyStyles: {
        fontSize: 12,
        textColor: [0, 0, 0],
        halign: "center", // Center align body cells
      },
      columnStyles: {
        0: { halign: "center" }, // Center align the "No." column
        2: { halign: "center" }, // Center align the "SKS" column
      },
      didDrawPage: function (data) {
        // Draw a footer (page number)
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height || pageSize.getHeight();
        doc.setFontSize(10);
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          margin,
          pageHeight - 10
        );
      },
    });

    // Save the generated PDF
    doc.save(`${mahasiswa.nim}_KRS.pdf`);
  };

  // Open edit modal
  const openEditModal = (mahasiswa: Mahasiswa) => {
    setFormData({
      nim: mahasiswa.nim,
      nama: mahasiswa.nama,
      ipk: mahasiswa.ipk.toString(),
      sksMax: mahasiswa.sksMax.toString(),
    });
    setEditingMahasiswaId(mahasiswa.id);
    setIsEditModalOpen(true);
  };

  // Close edit modal
  const closeModal = () => {
    setIsEditModalOpen(false);
    setEditingMahasiswaId(null);
  };

  // Open course selection modal
  const openCourseModal = (mahasiswaId: number) => {
    setSelectedMahasiswaForCourse(mahasiswaId);
    setIsCourseModalOpen(true);
  };

  // Close course selection modal
  const closeCourseModal = () => {
    setIsCourseModalOpen(false);
    setSelectedCourses([]);
    setTotalSKS(0);
  };

  // Open SKS modal (Pop-Up)
  const openSksModal = (mahasiswa: Mahasiswa) => {
    setSelectedMahasiswaForSks(mahasiswa);
    setIsSksModalOpen(true); // Open modal
  };

  // Close SKS modal
  const closeSksModal = () => {
    setIsSksModalOpen(false); // Close modal
    setSelectedMahasiswaForSks(null); // Clear selected mahasiswa
  };

  // New Functionality: Delete KRS for a specific course
  const handleDeleteKrs = async (mahasiswaId: number, mataKuliahId: number) => {
    try {
      const response = await fetch(
        `/api/mahasiswa/${mahasiswaId}/delete-krs/${mataKuliahId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert("KRS deleted successfully!");
        setMahasiswaList((prev) =>
          prev.map((mahasiswa) =>
            mahasiswa.id === mahasiswaId
              ? {
                  ...mahasiswa,
                  krs: mahasiswa.krs.filter(
                    (krs) => krs.MataKuliah.id !== mataKuliahId
                  ),
                }
              : mahasiswa
          )
        );
      } else {
        const errorResult = await response.json();
        alert(errorResult.message || "Failed to delete KRS");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting KRS");
    }
  };

  return (
    // <Layout>
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Input Mahasiswa</h1>
      <form
        onSubmit={handleSubmitMahasiswa}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <label className="block mb-2 font-medium">NIM</label>
        <input
          type="text"
          value={formData.nim}
          onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
          className="block w-full p-2 mb-4 border rounded-lg"
        />

        <label className="block mb-2 font-medium">Nama</label>
        <input
          type="text"
          value={formData.nama}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          className="block w-full p-2 mb-4 border rounded-lg"
        />

        <label className="block mb-2 font-medium">IPK</label>
        <input
          type="number"
          step="0.01"
          value={formData.ipk}
          onChange={(e) => {
            const ipk = e.target.value;
            setFormData({
              ...formData,
              ipk,
              sksMax: ipk && parseFloat(ipk) < 3 ? "20" : "24", // Automatically update SKS Max
            });
          }}
          className="block w-full p-2 mb-4 border rounded-lg"
        />

        <label className="block mb-2 font-medium">SKS Max</label>
        <input
          type="number"
          value={formData.sksMax}
          readOnly // SKS Max is read-only
          className="block w-full p-2 mb-4 border rounded-lg bg-gray-100 cursor-not-allowed"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add Mahasiswa
        </button>
      </form>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Edit Mahasiswa</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateMahasiswa();
              }}
              className="space-y-4"
            >
              <label className="block mb-2 font-medium">NIM</label>
              <input
                type="text"
                value={formData.nim}
                onChange={(e) =>
                  setFormData({ ...formData, nim: e.target.value })
                }
                className="block w-full p-2 mb-4 border rounded-lg"
              />
              <label className="block mb-2 font-medium">Nama</label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                className="block w-full p-2 mb-4 border rounded-lg"
              />
              <label className="block mb-2 font-medium">IPK</label>
              <input
                type="number"
                step="0.01"
                value={formData.ipk}
                onChange={(e) =>
                  setFormData({ ...formData, ipk: e.target.value })
                }
                className="block w-full p-2 mb-4 border rounded-lg"
              />
              <label className="block mb-2 font-medium">SKS Max</label>
              <input
                type="number"
                value={formData.sksMax}
                onChange={(e) =>
                  setFormData({ ...formData, sksMax: e.target.value })
                }
                className="block w-full p-2 mb-4 border rounded-lg"
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Selection Modal */}
      {isCourseModalOpen && selectedMahasiswaForCourse !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">
              Select Courses for Mahasiswa
            </h2>
            <div className="mb-4">
              <select
                onChange={(e) =>
                  handleSelectCourse(
                    mataKuliahList.find(
                      (course) => course.id === parseInt(e.target.value)
                    )!
                  )
                }
                className="border p-2 mb-4 rounded-lg w-full"
              >
                <option value="">Select Course</option>
                {mataKuliahList.map((mataKuliah) => {
                  const currentMahasiswa = mahasiswaList.find(
                    (mhs) => mhs.id === selectedMahasiswaForCourse
                  );

                  return (
                    <option
                      key={mataKuliah.id}
                      value={mataKuliah.id}
                      disabled={currentMahasiswa?.krs.some(
                        (krs) => krs.MataKuliah.id === mataKuliah.id
                      )}
                    >
                      {mataKuliah.namaMk} ({mataKuliah.sks} SKS)
                    </option>
                  );
                })}
              </select>

              <h3 className="text-xl font-semibold">Selected Courses</h3>
              <ul className="list-disc ml-6">
                {selectedCourses.map((course) => (
                  <li key={course.id}>{course.namaMk}</li>
                ))}
              </ul>

              <div className="mt-4">
                <p className="text-lg">Total SKS Added: {totalSKS}</p>
                <p className="text-lg text-red-500">
                  Remaining SKS: {remainingSKS}{" "}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() =>
                  handleAddCoursesToMahasiswa(selectedMahasiswaForCourse)
                }
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Add Courses
              </button>
              <button
                onClick={closeCourseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mt-10">Mahasiswa List</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-200 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3">NIM</th>
            <th className="border p-3">Nama</th>
            <th className="border p-3">IPK</th>
            <th className="border p-3">SKS Max</th>
            <th className="border p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mahasiswaList.map((mahasiswa) => (
            <tr key={mahasiswa.id}>
              <td className="border p-3">{mahasiswa.nim}</td>
              <td className="border p-3">{mahasiswa.nama}</td>
              <td className="border p-3">{mahasiswa.ipk}</td>
              <td className="border p-3">{mahasiswa.sksMax}</td>
              <td className="border p-3">
                <button
                  onClick={() => openEditModal(mahasiswa)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg mr-2"
                  key={`edit-${mahasiswa.id}`} // Unique key for Edit button
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteMahasiswa(mahasiswa.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  key={`delete-${mahasiswa.id}`} // Unique key for Delete button
                >
                  Delete
                </button>
                <button
                  onClick={() => openCourseModal(mahasiswa.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
                  key={`course-${mahasiswa.id}`} // Unique key for Course Selection button
                >
                  Select Courses
                </button>
                <button
                  onClick={() => openSksModal(mahasiswa)} // Open SKS Modal
                  className="bg-green-500 text-white px-4 py-2 rounded-lg ml-2"
                  key={`view-sks-${mahasiswa.id}`} // Unique key for View SKS button
                >
                  View SKS
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* SKS Modal (Pop-up) */}
      {isSksModalOpen && selectedMahasiswaForSks && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">
              SKS Details for {selectedMahasiswaForSks.nama}
            </h2>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3">No</th>
                  <th className="border p-3">Course Name</th>
                  <th className="border p-3">SKS</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedMahasiswaForSks.krs.map((krs, index) => (
                  <tr key={krs.MataKuliah.id}>
                    <td className="border p-3">{index + 1}</td>
                    <td className="border p-3">{krs.MataKuliah.namaMk}</td>
                    <td className="border p-3">{krs.MataKuliah.sks}</td>
                    <td className="border p-3">
                      <button
                        onClick={() =>
                          handleDeleteKrs(
                            selectedMahasiswaForSks.id,
                            krs.MataKuliah.id
                          )
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <button
                onClick={closeSksModal} // Close the modal
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
              {/* Print KRS Button */}
              <button
                onClick={() => generateKRS(selectedMahasiswaForSks)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Print KRS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mahasiswa;
