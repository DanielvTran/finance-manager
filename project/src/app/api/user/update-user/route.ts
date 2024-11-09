import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    // Get the token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

    // Destructure body
    const { email, password, firstName, lastName } = await req.json();

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 12);

    // Fetch user by id
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user data in the database
    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        email: email || undefined,
        password: hashedPassword || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
      },
    });

    // Return user data
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
