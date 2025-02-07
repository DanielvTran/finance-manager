import { jwtVerify, SignJWT } from "jose";
import type { TokenPayload } from "./types";

const accessTokenSecret = new TextEncoder().encode(process.env.JWT_SECRET_ACCESS as string);

export const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pages/income", label: "Income" },
  { href: "/pages/expense", label: "Expense" },
  { href: "/pages/budgeting", label: "Budgeting" },
  { href: "/pages/categories", label: "Categories" },
  { href: "/pages/settings", label: "Settings" },
];

export async function generateAccessToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1h").sign(accessTokenSecret);
}

export async function verifyToken(token: string, secret: Uint8Array): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as TokenPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export function sum(a: number, b: number) {
  return a + b;
}
