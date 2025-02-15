import { NextRequest, NextResponse } from "next/server";
import { loginUserSchema } from "../../../../../lib/validationSchema";
import { prisma } from "../../../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check for body validation
    const validation = loginUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    // Check for existing users
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 409 });
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(body.password, existingUser.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Create JWT access token
    const accessToken = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET_ACCESS as string,
      {
        expiresIn: "1h",
      }
    );

    // Create JWT refresh token
    const refreshToken = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET_REFRESH as string,
      {
        expiresIn: "30d",
      }
    );

    // Set Cookies
    const response = NextResponse.json({ message: "Login successful" }, { status: 200 });

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
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
