// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Redirect to login if no token is found
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// Configure middleware to protect specific routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
