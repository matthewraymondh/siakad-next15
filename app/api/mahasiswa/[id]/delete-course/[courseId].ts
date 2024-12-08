// pages/api/mahasiswa/[id]/delete-course/[courseId].ts

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, courseId } = req.query; // Get the mahasiswaId (id) and courseId from the URL

  if (req.method === "DELETE") {
    try {
      // Check if the Mahasiswa exists
      const mahasiswa = await prisma.mahasiswa.findUnique({
        where: { id: Number(id) },
      });

      if (!mahasiswa) {
        return res.status(404).json({ message: "Mahasiswa not found" });
      }

      // Delete the Krs (course registration) record that matches both mahasiswaId and mataKuliahId
      const deletedKrs = await prisma.krs.delete({
        where: {
          mahasiswaId_mataKuliahId: {
            mahasiswaId: Number(id),
            mataKuliahId: Number(courseId),
          },
        },
      });

      return res
        .status(200)
        .json({ message: "Course deleted successfully", deletedKrs });
    } catch (error) {
      console.error("Error deleting course:", error);
      return res.status(500).json({ message: "Error deleting course" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }
}
