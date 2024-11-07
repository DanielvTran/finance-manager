import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "../../../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUserSchema = z.object({
  email: z.string().email("Invalid email").trim().max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(255),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check for body validation
    const validation = createUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    // Check for existing users
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(body.password, existingUser.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    // Set Cookies
    const response = NextResponse.json({ message: "Login successful" }, { status: 200 });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
