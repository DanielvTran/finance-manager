import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  // Access the token from cookies
  const token = request.cookies.get("token")?.value;

  // Log the token for debugging purposes
  console.log("Token from cookies:", token);

  // If no token, redirect to login
  if (!token) {
    console.log("No token found, redirecting to login");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    await jwtVerify(token, secret);
    console.log("Token verified, proceeding to dashboard");
    return NextResponse.next();
  } catch (error) {
    console.log("Token verification failed, redirecting to login:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// Configure middleware to protect specific routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/pages/income/:path*",
    "/pages/expense/:path*",
    "/pages/budgeting/:path*",
    "/pages/categories/:path*",
    "/pages/reports/:path*",
    "/pages/settings/:path*",
  ],
};
