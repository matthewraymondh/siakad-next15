// app/api/mataKuliah/route.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// CREATE: Add new MataKuliah (course)
export async function POST(req: Request) {
  try {
    const { kodeMk, namaMk, sks } = await req.json();

    const newMataKuliah = await prisma.mataKuliah.create({
      data: {
        kodeMk,
        namaMk,
        sks,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Course added successfully",
        mataKuliah: newMataKuliah,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error adding course", error }),
      { status: 500 }
    );
  }
}

// READ: Fetch all MataKuliah (courses)
export async function GET() {
  try {
    const mataKuliah = await prisma.mataKuliah.findMany();
    return new Response(JSON.stringify({ mataKuliah }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error fetching courses", error }),
      { status: 500 }
    );
  }
}

// UPDATE: Update a MataKuliah (course)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const mataKuliahId = parseInt(params.id);

  try {
    const { kodeMk, namaMk, sks } = await req.json();

    const updatedMataKuliah = await prisma.mataKuliah.update({
      where: { id: mataKuliahId },
      data: {
        kodeMk,
        namaMk,
        sks,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Course updated successfully",
        mataKuliah: updatedMataKuliah,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error updating course", error }),
      { status: 500 }
    );
  }
}

// DELETE: Delete a MataKuliah (course)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const mataKuliahId = parseInt(params.id);

  try {
    await prisma.mataKuliah.delete({
      where: { id: mataKuliahId },
    });

    return new Response(
      JSON.stringify({ message: "Course deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error deleting course", error }),
      { status: 500 }
    );
  }
}
