import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface Params {
  id: string;
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const mahasiswaId = parseInt(params.id, 10); // Important: Parse with radix

  if (isNaN(mahasiswaId)) {
    return NextResponse.json(
      { message: "Invalid Mahasiswa ID" },
      { status: 400 }
    );
  }

  try {
    const { mataKuliahIds } = await req.json();

    if (
      !Array.isArray(mataKuliahIds) ||
      mataKuliahIds.some((id) => typeof id !== "number")
    ) {
      return NextResponse.json(
        { message: "Invalid Mata Kuliah IDs" },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { message: "All selected courses are already assigned." },
        { status: 400 }
      );
    }

    await prisma.krs.createMany({
      data: newCourseIds.map((mataKuliahId: number) => ({
        mahasiswaId,
        mataKuliahId,
      })),
    });

    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      include: { krs: { include: { MataKuliah: true } } },
    });

    return NextResponse.json(
      {
        message: `Added ${newCourseIds.length} new courses to Mahasiswa.`,
        mahasiswa,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding courses:", error);
    return NextResponse.json(
      {
        message: "Error adding courses",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
