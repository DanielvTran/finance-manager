import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import jwt from "jsonwebtoken";

export async function DELETE(req: NextRequest) {
  try {
    // Get the token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

    // Fetch user data from the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the user by id
    const deletedUser = await prisma.user.delete({
      where: { id: decoded.id },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    console.log(deletedUser);

    // Expire the token
    const response = NextResponse.json({ message: "User deleted successfully", deletedUser }, { status: 200 });

    response.cookies.set("token", "", { maxAge: 0, path: "/" });

    // Return user data
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
