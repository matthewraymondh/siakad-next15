import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const mahasiswaId = parseInt(params.id, 10); // Parse Mahasiswa ID from URL

  if (isNaN(mahasiswaId)) {
    return new Response(JSON.stringify({ message: "Invalid Mahasiswa ID" }), {
      status: 400,
    });
  }

  try {
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      include: { krs: { include: { MataKuliah: true } } },
    });

    if (!mahasiswa) {
      return new Response(JSON.stringify({ message: "Mahasiswa not found" }), {
        status: 404,
      });
    }

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
  const mahasiswaId = parseInt(params.id, 10); // Parse Mahasiswa ID

  if (isNaN(mahasiswaId)) {
    return new Response(JSON.stringify({ message: "Invalid Mahasiswa ID" }), {
      status: 400,
    });
  }

  try {
    // Check if the Mahasiswa exists
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
    });

    if (!mahasiswa) {
      return new Response(JSON.stringify({ message: "Mahasiswa not found" }), {
        status: 404,
      });
    }

    // Delete the Mahasiswa (Cascade delete if relations exist)
    await prisma.mahasiswa.delete({
      where: { id: mahasiswaId },
    });

    return new Response(
      JSON.stringify({ message: "Mahasiswa deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting Mahasiswa:", error);
    return new Response(
      JSON.stringify({
        message: "Error deleting Mahasiswa",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const mahasiswaId = parseInt(params.id, 10);

  if (isNaN(mahasiswaId)) {
    return new Response(JSON.stringify({ message: "Invalid Mahasiswa ID" }), {
      status: 400,
    });
  }

  try {
    const data = await req.json();

    // Validate the input
    const { nim, nama, ipk, sksMax } = data;
    if (!nim || !nama || isNaN(ipk) || isNaN(sksMax)) {
      return new Response(JSON.stringify({ message: "Invalid input data" }), {
        status: 400,
      });
    }

    // Update the Mahasiswa
    const updatedMahasiswa = await prisma.mahasiswa.update({
      where: { id: mahasiswaId },
      data: {
        nim,
        nama,
        ipk: parseFloat(ipk),
        sksMax: parseInt(sksMax, 10),
      },
    });

    return new Response(
      JSON.stringify({
        message: "Mahasiswa updated successfully",
        updatedMahasiswa,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating Mahasiswa:", error);
    return new Response(
      JSON.stringify({
        message: "Error updating Mahasiswa",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
}
