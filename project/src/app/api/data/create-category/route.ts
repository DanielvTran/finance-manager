import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    // Get the token from cookies
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS as string) as { id: number };

    // Parse the request body to get the category name
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    // Create the new category associated with the user
    const newCategory = await prisma.category.create({
      data: {
        name,
        userId: decoded.id,
      },
    });

    // Return the created category
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token or server error" }, { status: 401 });
  }
}
