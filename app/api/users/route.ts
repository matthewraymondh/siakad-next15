// app/api/users/route.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { username, password, role, requesterRole } = await req.json();

  if (requesterRole !== "superadmin") {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 403,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });

    return new Response(
      JSON.stringify({ message: "User created successfully", user }),
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
