// app/api/superadmin/route.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const superadmin = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "superadmin",
      },
    });

    return new Response(
      JSON.stringify({ message: "Superadmin created", user: superadmin }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error creating user", error }),
      {
        status: 500,
      }
    );
  }
}
