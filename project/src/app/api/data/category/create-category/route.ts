import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
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
    let { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    // Make sure first letter is uppercase and the rest are lowercase
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    // Check if a category with the same name already exists for the user
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        userId: decoded.id,
      },
    });

    if (existingCategory) {
      return NextResponse.json({ error: "Category already exists for this user" }, { status: 400 });
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
    console.error(error);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again later." }, { status: 500 });
  }
}
