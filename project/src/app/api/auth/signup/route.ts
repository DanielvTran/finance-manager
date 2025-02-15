import { NextRequest, NextResponse } from "next/server";
import { signupUserSchema } from "../../../../../lib/validationSchema";
import { prisma } from "../../../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check for body validation
    const validation = signupUserSchema.safeParse(body);

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
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    if (!newUser) {
      return NextResponse.json({ error: "User creation failed" }, { status: 500 });
    }

    // Create JWT access token
    const accessToken = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET_ACCESS as string, {
      expiresIn: "1h",
    });

    // Create JWT refresh token
    const refreshToken = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET_REFRESH as string, {
      expiresIn: "30d",
    });

    // Set Cookies
    const response = NextResponse.json({ body: newUser }, { status: 201 });

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2592000, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
