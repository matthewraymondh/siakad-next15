// app/api/mahasiswa/route.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// CREATE: Add new Mahasiswa
export async function POST(req: Request) {
  try {
    const { nim, nama, ipk, sksMax } = await req.json();

    const newMahasiswa = await prisma.mahasiswa.create({
      data: {
        nim,
        nama,
        ipk,
        sksMax,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Mahasiswa added successfully",
        mahasiswa: newMahasiswa,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error adding mahasiswa", error }),
      { status: 500 }
    );
  }
}

// READ: Fetch all Mahasiswa
export async function GET() {
  try {
    const mahasiswa = await prisma.mahasiswa.findMany({
      include: { krs: { include: { MataKuliah: true } } }, // Include courses linked to Mahasiswa
    });
    return new Response(JSON.stringify({ mahasiswa }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error fetching mahasiswa", error }),
      { status: 500 }
    );
  }
}

// UPDATE: Update an existing Mahasiswa
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const mahasiswaId = parseInt(params.id);

  try {
    const { nim, nama, ipk, sksMax } = await req.json();

    const updatedMahasiswa = await prisma.mahasiswa.update({
      where: { id: mahasiswaId },
      data: {
        nim,
        nama,
        ipk,
        sksMax,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Mahasiswa updated successfully",
        mahasiswa: updatedMahasiswa,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error updating mahasiswa", error }),
      { status: 500 }
    );
  }
}

// DELETE: Delete a Mahasiswa
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const mahasiswaId = parseInt(params.id);

  try {
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
