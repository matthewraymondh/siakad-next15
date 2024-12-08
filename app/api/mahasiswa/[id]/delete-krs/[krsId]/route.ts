// app/api/mahasiswa/[id]/delete-krs/[krsId]/route.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; krsId: string } }
) {
  const mahasiswaId = parseInt(params.id); // Extract mahasiswa ID from URL parameters
  const krsId = parseInt(params.krsId); // Extract KRS ID (course ID)

  try {
    // Delete the KRS record (the course linked to Mahasiswa)
    const deletedKrs = await prisma.krs.delete({
      where: { id: krsId },
    });

    // Fetch the updated Mahasiswa data
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      include: { krs: { include: { MataKuliah: true } } },
    });

    return new Response(
      JSON.stringify({ message: "Course deleted successfully", mahasiswa }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error deleting course", error }),
      { status: 500 }
    );
  }
}
