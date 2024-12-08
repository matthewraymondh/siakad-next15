import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const mahasiswaId = parseInt(params.id); // Parse Mahasiswa ID from URL

  // Validate Mahasiswa ID
  if (isNaN(mahasiswaId)) {
    return new Response(JSON.stringify({ message: "Invalid Mahasiswa ID" }), {
      status: 400,
    });
  }

  try {
    // Fetch Mahasiswa with their KRS and MataKuliah details
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      include: { krs: { include: { MataKuliah: true } } },
    });

    if (!mahasiswa) {
      // Return 404 if Mahasiswa not found
      return new Response(JSON.stringify({ message: "Mahasiswa not found" }), {
        status: 404,
      });
    }

    // Return the fetched Mahasiswa data
    return new Response(JSON.stringify({ mahasiswa }), { status: 200 });
  } catch (error) {
    console.error("Error fetching Mahasiswa:", error);
    return new Response(
      JSON.stringify({
        message: "Error fetching Mahasiswa details",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const mahasiswaId = parseInt(params.id, 10); // Convert the ID to an integer

  try {
    // Delete the mahasiswa using Prisma
    await prisma.mahasiswa.delete({
      where: { id: mahasiswaId },
    });

    return new Response(
      JSON.stringify({ message: "Mahasiswa deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error deleting mahasiswa", error }),
      { status: 500 }
    );
  }
}
