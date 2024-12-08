"use client";

import { jsPDF } from "jspdf";
import "jspdf-autotable";

type MataKuliah = { id: number; kodeMk: string; namaMk: string; sks: number };
type Krs = { id: number; MataKuliah: MataKuliah };
type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  ipk: number;
  sksMax: number;
  krs: Krs[];
};

export default function ViewSKS({ mahasiswa }: { mahasiswa: Mahasiswa }) {
  // Delete a course
  const handleDeleteCourse = async (mahasiswaId: number, courseId: number) => {
    try {
      const response = await fetch(
        `/api/mahasiswa/${mahasiswaId}/delete-course/${courseId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(result.message || "Course deleted successfully!");
        // You can update the course list or perform other actions
      } else {
        const errorResult = await response.json();
        alert(errorResult.message || "Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("An error occurred while deleting the course");
    }
  };

  // Generate KRS PDF
  const generateKRS = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text("Kartu Rencana Studi (KRS)", 10, 20);
    doc.setFontSize(14);
    doc.text(`NIM: ${mahasiswa.nim}`, 10, 30);
    doc.text(`Nama: ${mahasiswa.nama}`, 10, 40);
    doc.text(`IPK: ${mahasiswa.ipk}`, 10, 50);
    doc.text(`SKS Max: ${mahasiswa.sksMax}`, 10, 60);

    const yOffset = 75;
    doc.autoTable({
      startY: yOffset,
      head: [["No.", "Course Name", "SKS"]],
      body: mahasiswa.krs.map((krs, index) => [
        index + 1,
        krs.MataKuliah.namaMk,
        krs.MataKuliah.sks,
      ]),
      theme: "grid",
      styles: { fontSize: 12 },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] },
    });

    doc.save(`${mahasiswa.nim}_KRS.pdf`);
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">
        SKS Details for {mahasiswa.nama}
      </h1>
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
          {mahasiswa.krs.map((krs, index) => (
            <tr key={krs.id}>
              <td className="border p-3">{index + 1}</td>
              <td className="border p-3">{krs.MataKuliah.namaMk}</td>
              <td className="border p-3">{krs.MataKuliah.sks}</td>
              <td className="border p-3">
                <button
                  onClick={() => handleDeleteCourse(mahasiswa.id, krs.id)} // Pass mahasiswa.id and krs.id correctly
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={generateKRS}
        className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
      >
        Print KRS
      </button>
    </div>
  );
}
