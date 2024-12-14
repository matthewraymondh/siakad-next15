import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// CREATE: Add new MataKuliah (course)
export async function POST(req: Request) {
  try {
    const { kodeMk, namaMk, sks, ruangan } = await req.json();

    const newMataKuliah = await prisma.mataKuliah.create({
      data: {
        kodeMk,
        namaMk,
        sks,
        ruangan,
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
    console.error("Error adding course:", error);
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
    console.error("Error fetching courses:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching courses", error }),
      { status: 500 }
    );
  }
}
