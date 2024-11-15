import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    console.log("Token received:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS as string) as { id: number };
    console.log("Decoded Token Payload:", decoded);

    const { email, password, firstName, lastName } = await req.json();
    console.log("Request body:", { email, password, firstName, lastName });

    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Fetched user:", user);

    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        email: email || undefined,
        password: hashedPassword || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      },
    });

    console.log("Updated user:", updatedUser);

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Server error or invalid token" }, { status: 500 });
  }
}
