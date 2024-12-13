import { PrismaClient, PrismaClientKnownRequestError } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; krsId: string } }
) {
  // Await params to ensure they are available for use
  const { id, krsId } = params;

  if (!id || !krsId) {
    return new Response(
      JSON.stringify({ message: "Invalid ID or KRS ID provided" }),
      { status: 400 }
    );
  }

  const mahasiswaId = parseInt(id); // Parse the mahasiswaId
  const mataKuliahId = parseInt(krsId); // Parse the MataKuliahId

  console.log(
    `DELETE request: mahasiswaId = ${mahasiswaId}, mataKuliahId = ${mataKuliahId}`
  );

  // Validate if both IDs are numbers
  if (isNaN(mahasiswaId) || isNaN(mataKuliahId)) {
    return new Response(
      JSON.stringify({ message: "Invalid mahasiswa ID or MataKuliah ID" }),
      { status: 400 }
    );
  }

  try {
    // Check if the KRS record exists
    const krs = await prisma.krs.findUnique({
      where: {
        mahasiswaId_mataKuliahId: {
          mahasiswaId,
          mataKuliahId,
        },
      },
    });

    if (!krs) {
      console.log(
        `KRS record not found for mahasiswaId = ${mahasiswaId}, mataKuliahId = ${mataKuliahId}`
      );
      return new Response(JSON.stringify({ message: "KRS not found" }), {
        status: 404,
      });
    }

    // Delete the KRS record
    await prisma.krs.delete({
      where: {
        id: krs.id, // Deleting by the KRS ID
      },
    });

    // Fetch the updated Mahasiswa data
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      include: {
        krs: {
          include: { MataKuliah: true },
        },
      },
    });

    if (!mahasiswa) {
      console.log(`Mahasiswa not found with ID = ${mahasiswaId}`);
      return new Response(JSON.stringify({ message: "Mahasiswa not found" }), {
        status: 404,
      });
    }

    console.log(`KRS deleted successfully for mahasiswaId = ${mahasiswaId}`);

    return new Response(
      JSON.stringify({
        message: "Course deleted successfully",
        mahasiswa,
      }),
      { status: 200 }
    );
  } catch (error) {
    // Prisma specific error handling
    if (error instanceof PrismaClientKnownRequestError) {
      console.error("Prisma error:", error);
      return new Response(
        JSON.stringify({
          message: "Prisma error occurred while deleting course",
          error: error.message,
          code: error.code,
        }),
        { status: 500 }
      );
    }
    // General error handling
    console.error("Error deleting course:", error);
    return new Response(
      JSON.stringify({
        message: "Error deleting course",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
}
