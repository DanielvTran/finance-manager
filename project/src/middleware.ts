import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateAccessToken, verifyToken } from "../lib";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const accessTokenSecret = new TextEncoder().encode(process.env.JWT_SECRET_ACCESS as string);
  const refreshTokenSecret = new TextEncoder().encode(process.env.JWT_SECRET_REFRESH as string);

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Redirect to login if no tokens found
  if (!accessToken && !refreshToken) {
    console.log("No tokens found, redirecting to login");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Attempt to verify the access token
  const accessPayload = accessToken ? await verifyToken(accessToken, accessTokenSecret) : null;
  if (accessPayload) {
    console.log("Access token verified, proceeding");
    return NextResponse.next();
  }

  // If access token is missing or invalid, verify refresh token
  const refreshPayload = refreshToken ? await verifyToken(refreshToken, refreshTokenSecret) : null;
  if (!refreshPayload) {
    console.log("No valid refresh token, redirecting to login");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Generate a new access token if refresh token is valid
  try {
    const newAccessToken = await generateAccessToken({
      id: refreshPayload.id,
      email: refreshPayload.email,
    });

    const response = NextResponse.next();

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });

    console.log("New access token issued, proceeding to requested page");
    return response;
  } catch (error) {
    console.error("Error issuing new access token:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// Protect specific routes
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
