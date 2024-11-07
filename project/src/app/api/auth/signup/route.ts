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

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(body.password, 12);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
      },
    });

    // Create JWT token
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    // Set Cookies
    const response = NextResponse.json({ user: newUser, status: 201 });

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
