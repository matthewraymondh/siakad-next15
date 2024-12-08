import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; courseId: string } }
) {
  const mahasiswaId = parseInt(params.id);
  const courseId = parseInt(params.courseId); // Extract course ID from URL

  try {
    // Check if the Mahasiswa and course relationship exists
    const krsEntry = await prisma.krs.findFirst({
      where: {
        mahasiswaId,
        mataKuliahId: courseId,
      },
    });

    if (!krsEntry) {
      return new Response(
        JSON.stringify({ message: "Course not found for this Mahasiswa" }),
        { status: 404 }
      );
    }

    // Delete the course association (KRS record)
    await prisma.krs.delete({
      where: { id: krsEntry.id },
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
