// app/api/mahasiswa/[id]/add-courses/route.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const mahasiswaId = parseInt(params.id); // Extract mahasiswa ID from URL parameters
  const { mataKuliahIds } = await req.json(); // Extract course IDs from request body

  try {
    // Create Krs records to associate Mahasiswa with MataKuliah (courses)
    const krsEntries = await prisma.krs.createMany({
      data: mataKuliahIds.map((mataKuliahId: number) => ({
        mahasiswaId,
        mataKuliahId,
      })),
    });

    // Fetch updated Mahasiswa data with the newly added courses
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      include: { krs: { include: { MataKuliah: true } } }, // Include MataKuliah (course) details
    });

    return new Response(
      JSON.stringify({ message: "Courses added to Mahasiswa", mahasiswa }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error adding courses", error }),
      { status: 500 }
    );
  }
}
