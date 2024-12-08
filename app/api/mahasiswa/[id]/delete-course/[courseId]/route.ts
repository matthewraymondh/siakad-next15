import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DELETE method for deleting a course for a specific mahasiswa
export async function DELETE(
  req: Request,
  { params }: { params: { id: string; courseId: string } }
) {
  const mahasiswaId = parseInt(params.id, 10); // Convert the mahasiswa ID to an integer
  const courseId = parseInt(params.courseId, 10); // Convert the course ID to an integer

  try {
    // Delete the course association for the mahasiswa
    await prisma.mahasiswa.update({
      where: { id: mahasiswaId },
      data: {
        courses: {
          disconnect: {
            id: courseId, // Disconnect the course from the mahasiswa
          },
        },
      },
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
