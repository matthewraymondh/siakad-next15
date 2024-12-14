import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// UPDATE: Update a MataKuliah (course)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const mataKuliahId = parseInt(params.id);

  if (isNaN(mataKuliahId)) {
    return new Response(JSON.stringify({ message: "Invalid course ID" }), {
      status: 400,
    });
  }

  try {
    const { kodeMk, namaMk, sks, ruangan } = await req.json();

    const updatedMataKuliah = await prisma.mataKuliah.update({
      where: { id: mataKuliahId },
      data: {
        kodeMk,
        namaMk,
        sks,
        ruangan,
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
    console.error("Error updating course:", error);
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

  if (isNaN(mataKuliahId)) {
    return new Response(JSON.stringify({ message: "Invalid course ID" }), {
      status: 400,
    });
  }

  try {
    await prisma.mataKuliah.delete({
      where: { id: mataKuliahId },
    });

    return new Response(
      JSON.stringify({ message: "Course deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting course:", error);
    return new Response(
      JSON.stringify({ message: "Error deleting course", error }),
      { status: 500 }
    );
  }
}
