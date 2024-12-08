// app/api/mahasiswa/[id]/add-courses/route.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const mahasiswaId = parseInt(params.id);
  const { mataKuliahIds } = await req.json();

  try {
    // Check for duplicate courses
    const existingKrs = await prisma.krs.findMany({
      where: {
        mahasiswaId,
        mataKuliahId: { in: mataKuliahIds },
      },
    });

    const existingCourseIds = existingKrs.map((krs) => krs.mataKuliahId);
    const newCourseIds = mataKuliahIds.filter(
      (id: number) => !existingCourseIds.includes(id)
    );

    if (newCourseIds.length === 0) {
      return new Response(
        JSON.stringify({
          message: "All selected courses are already assigned.",
        }),
        { status: 400 }
      );
    }

    // Create Krs records for new courses only
    await prisma.krs.createMany({
      data: newCourseIds.map((mataKuliahId: number) => ({
        mahasiswaId,
        mataKuliahId,
      })),
    });

    // Fetch updated Mahasiswa with new KRS details
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      include: { krs: { include: { MataKuliah: true } } },
    });

    return new Response(
      JSON.stringify({
        message: `Added ${newCourseIds.length} new courses to Mahasiswa.`,
        mahasiswa,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding courses:", error);
    return new Response(
      JSON.stringify({ message: "Error adding courses", error }),
      { status: 500 }
    );
  }
}
