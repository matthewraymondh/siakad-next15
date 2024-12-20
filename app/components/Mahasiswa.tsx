"use client"; // Mark this as a client component

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import the jsPDF AutoTable plugin
import { toast } from "sonner";
// import Link from "next/link"; // Import Link for navigation

// Types for Mahasiswa and MataKuliah
type MataKuliah = {
  id: number;
  kodeMk: string;
  namaMk: string;
  sks: number;
  ruangan: string;
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<{
    id: number;
    nama: string;
  } | null>(null);

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

    try {
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
        toast.success(result.message || "Mahasiswa successfully added!");
      } else {
        toast.error(result.message || "Failed to add mahasiswa.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred while adding mahasiswa.");
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

    try {
      const response = await fetch(`/api/mahasiswa/${editingMahasiswaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Mahasiswa updated successfully!");
        setMahasiswaList((prev) =>
          prev.map((mahasiswa) =>
            mahasiswa.id === editingMahasiswaId
              ? { ...mahasiswa, ...updatedData }
              : mahasiswa
          )
        );
        closeModal();
      } else {
        toast.error(result.message || "Failed to update mahasiswa.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while updating mahasiswa.");
    }
  };

  // Delete Mahasiswa
  const handleDeleteMahasiswa = (
    mahasiswaId: number,
    mahasiswaName: string
  ) => {
    setSelectedMahasiswa({ id: mahasiswaId, nama: mahasiswaName });
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteMahasiswa = async () => {
    if (!selectedMahasiswa) return;

    try {
      const response = await fetch(`/api/mahasiswa/${selectedMahasiswa.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const result = await response.json();
        setMahasiswaList((prev) =>
          prev.filter((mahasiswa) => mahasiswa.id !== selectedMahasiswa.id)
        );
        toast.success(result.message || "Mahasiswa deleted successfully!");
      } else {
        const errorResult = await response.json();
        toast.error(errorResult.message || "Failed to delete Mahasiswa.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred while deleting Mahasiswa.");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedMahasiswa(null);
    }
  };

  const cancelDeleteMahasiswa = () => {
    setIsDeleteModalOpen(false);
    setSelectedMahasiswa(null);
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

    // Ensure mahasiswa exists and has an initialized krs array
    if (!mahasiswa) {
      toast.error("Mahasiswa not found.");
      return;
    }

    if (!Array.isArray(mahasiswa.krs)) {
      mahasiswa.krs = []; // Initialize `krs` as an empty array if undefined
    }

    // Get dynamic max SKS value from the mahasiswa object
    const MAX_SKS = mahasiswa.sksMax || 24; // Default to 24 if `sksMax` is undefined

    // Filter out duplicate courses in the frontend
    const existingCourseIds = mahasiswa.krs.map((krs) => krs.MataKuliah.id);
    const uniqueCourses = selectedCourses.filter(
      (course) => !existingCourseIds.includes(course.id)
    );

    // Check if there are no unique courses to add
    if (uniqueCourses.length === 0) {
      toast.info("All selected courses are already assigned to this student.");
      return;
    }

    // Calculate the current total SKS for the mahasiswa
    const currentSKS = mahasiswa.krs.reduce(
      (total, krs) => total + (krs.MataKuliah.sks || 0),
      0
    );

    // Calculate the SKS for the new courses
    const newCoursesSKS = uniqueCourses.reduce(
      (total, course) => total + course.sks,
      0
    );

    // Check if adding the selected courses exceeds the max SKS
    if (currentSKS + newCoursesSKS > MAX_SKS) {
      toast.error(`Cannot add courses. SKS quota of ${MAX_SKS} reached.`);
      return;
    }

    try {
      const response = await fetch(
        `/api/mahasiswa/${mahasiswaId}/add-courses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mataKuliahIds: uniqueCourses.map((course) => course.id),
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Courses added successfully!");

        // Update the mahasiswa list with the new courses
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
        toast.error(result.message || "Failed to add courses");
      }
    } catch (error) {
      console.error("Error adding courses:", error);
      toast.error("An error occurred while adding courses.");
    }
  };

  const generateKRS = (mahasiswa: Mahasiswa) => {
    const doc = new jsPDF();

    // Set document margins and font
    const margin = 15;
    doc.setFont("times", "normal");
    doc.setFontSize(12);

    // Title of the document
    doc.setFontSize(20);
    doc.setFont("times", "bold");
    doc.text("Kartu Rencana Studi (KRS)", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(`NIM: ${mahasiswa.nim}`, margin, 40);
    doc.text(`Nama: ${mahasiswa.nama}`, margin, 50);
    doc.text(`IPK: ${mahasiswa.ipk}`, margin, 60);
    doc.text(`SKS Max: ${mahasiswa.sksMax}`, margin, 70);

    let yOffset = 85; // Start position for the courses table

    // Calculate total SKS
    const totalSKS = mahasiswa.krs.reduce(
      (sum, krs) => sum + krs.MataKuliah.sks,
      0
    );

    // Table Body using autoTable, now including ruangan column
    doc.autoTable({
      startY: yOffset,
      head: [["No.", "Course Name", "Ruangan", "SKS"]], // Add 'Ruangan' header
      body: mahasiswa.krs.map((krs, index) => [
        index + 1,
        krs.MataKuliah.namaMk,
        krs.MataKuliah.ruangan, // Include ruangan value
        krs.MataKuliah.sks,
      ]),
      margin: { left: margin, right: margin },
      theme: "striped",
      styles: {
        fontSize: 11,
        cellPadding: 4,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [54, 57, 73], // Dark academic blue
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        fontSize: 11,
        textColor: [0, 0, 0],
        halign: "center",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 20 },
        1: { halign: "left", cellWidth: 90 },
        2: { halign: "center", cellWidth: 40 },
        3: { halign: "center", cellWidth: 30 }, // Adjust column width for ruangan
      },
      didDrawPage: function () {
        // Draw a footer (page number)
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height || pageSize.getHeight();
        const pageWidth = pageSize.width || pageSize.getWidth();

        // Draw a footer
        doc.setFontSize(10);
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          margin,
          pageHeight - 15
        );
        doc.setFontSize(8);
        doc.text("SISTEM KRS BY MATTHEW RAYMOND", 105, pageHeight - 10, {
          align: "center",
        });

        // Add date and time on the right
        const date = new Date();
        const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        doc.text(formattedDate, pageWidth - margin, pageHeight - 10, {
          align: "right",
        });
      },
    });

    // Display total SKS
    yOffset = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text(`Total SKS: ${totalSKS}`, margin, yOffset);

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
        // const responseBody = await response.json();

        // Notify success using Sonner
        toast.success("KRS deleted successfully!");

        // Update mahasiswa list after KRS deletion
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

        // Recalculate and update total SKS after deletion
        const updatedMahasiswa = mahasiswaList.find(
          (mhs) => mhs.id === mahasiswaId
        );

        if (updatedMahasiswa) {
          const updatedSKS = updatedMahasiswa.krs.reduce(
            (total, krs) => total + krs.MataKuliah.sks,
            0
          );

          setSelectedMahasiswaForSks({
            ...updatedMahasiswa,
            totalSks: updatedSKS,
          });
        }
      } else {
        const errorResult = await response.text();
        console.error("Server Error:", errorResult);

        // Notify error using Sonner
        toast.error(errorResult || "Failed to delete KRS. Please try again.");
      }
    } catch (error) {
      console.error("Client Error:", error);

      // Notify error using Sonner
      toast.error("An error occurred while deleting KRS. Please try again.");
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
                      disabled={
                        currentMahasiswa?.krs?.some(
                          (krs) => krs.MataKuliah.id === mataKuliah.id
                        ) || false
                      } // Ensure disabled evaluates to a boolean
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
                  onClick={() =>
                    handleDeleteMahasiswa(mahasiswa.id, mahasiswa.nama)
                  } // Pass ID and Name
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

      {isDeleteModalOpen && selectedMahasiswa && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">
              Are you sure you want to delete {selectedMahasiswa.nama}?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={cancelDeleteMahasiswa}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteMahasiswa}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SKS Modal (Pop-up) */}
      {isSksModalOpen && selectedMahasiswaForSks && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-106">
            <h2 className="text-xl font-bold mb-4">
              SKS Details for {selectedMahasiswaForSks.nama}
            </h2>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3">No</th>
                  <th className="border p-3">Course Name</th>
                  <th className="border p-3">SKS</th>
                  <th className="border p-3">Ruang</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedMahasiswaForSks?.krs?.map((krs, index) => (
                  <tr key={krs.MataKuliah.id}>
                    <td className="border p-3">{index + 1}</td>
                    <td className="border p-3">{krs.MataKuliah.namaMk}</td>
                    <td className="border p-3">{krs.MataKuliah.sks}</td>
                    <td className="border p-3">{krs.MataKuliah.ruangan}</td>
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
                )) || (
                  <tr>
                    <td colSpan="4" className="text-center p-3">
                      No KRS data available.
                    </td>
                  </tr>
                )}
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
