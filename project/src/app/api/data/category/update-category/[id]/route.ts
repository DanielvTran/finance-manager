import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../../lib/prisma";
import jwt from "jsonwebtoken";

export async function PUT(req: NextRequest) {
  try {
    // Get the token from cookies
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS as string) as { id: number };

    // Extract the category ID from the URL
    const url = new URL(req.url);
    const id = Number(url.pathname.split("/").pop());

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    // Parse the request body to get the category name
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    // Find the category to ensure it exists and belongs to the authenticated user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id,
        userId: decoded.id,
      },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found or unauthorized access" }, { status: 404 });
    }

    // Update the category with the provided fields
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
      },
    });

    // Return the created category
    return NextResponse.json(updatedCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token or server error" }, { status: 401 });
  }
}
