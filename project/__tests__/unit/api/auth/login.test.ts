import { POST } from "@/app/api/auth/login/route";
import { NextRequest } from "next/server";
import { prismaMock } from "../../../../lib/prismaSingleton";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* 
    Mock module imports
    Example: Not actually connecting to MySQL database using prisma
*/

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

// Create test suite for login endpoint
describe("POST /auth/login", () => {
  // Setup mock environment variables
  const originalEnv = process.env;

  // Prevents modules interfering before each test case
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      JWT_SECRET_ACCESS: "test_access_secret",
      JWT_SECRET_REFRESH: "test_refresh_secret",
      NODE_ENV: "development",
    };
  });

  // Re-assign environment variables
  afterEach(() => {
    process.env = originalEnv;
  });

  // Test 1: Check for invalid body
  it("should return 400 if the request body is invalid", async () => {
    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({ email: "not-an-email", password: "short" }),
    });

    const response = await POST(request);

    if (response) {
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body).toEqual(expect.arrayContaining([expect.objectContaining({ message: expect.any(String) })]));
    }
  });

  // Test 2: Check if the user exists
  it("should return 401 if the user does not exist", async () => {
    // Mock `prisma.user.findUnique` to return null
    prismaMock.user.findUnique.mockResolvedValue(null);

    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({ email: "nonexistent@example.com", password: "password123" }),
    });

    const response = await POST(request);

    if (response) {
      expect(response.status).toBe(409);
      const body = await response.json();
      expect(body.error).toBe("Invalid email or password");
    }
  });

  // Test 3: Check for valid cookies being set
  it("should return 200 and set cookies for valid credentials", async () => {
    // Mock user data from Prisma
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      email: "John.Doe@example.com",
      password: "$2b$12$A9E9aX7XE8AvK8HEuCjueu67TSUlMY1H77zywsC5hh6Yx8/f/8yMO",
      firstName: "John",
      lastName: "Doe",
      createdAt: new Date("2023-01-01T00:00:00Z"),
      updatedAt: new Date("2023-11-25T10:15:00Z"),
    });

    // Mock bcrypt password comparison
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    // Mock JWT token generation
    const mockAccessToken = "mocked_access_token";
    const mockRefreshToken = "mocked_refresh_token";

    (jwt.sign as jest.Mock)
      .mockImplementationOnce(() => mockAccessToken)
      .mockImplementationOnce(() => mockRefreshToken);

    // Simulate HTTP request
    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({ email: "John.Doe@example.com", password: "password123" }),
    });

    // Call the POST handler
    const response = await POST(request);

    if (response) {
      // Assert HTTP status
      expect(response.status).toBe(200);

      // Assert response body
      const body = await response.json();
      expect(body.message).toBe("Login successful");

      // Assert cookies
      const cookies = response.cookies;

      expect(cookies.get("accessToken")?.value).toBe(mockAccessToken); // Access token
      expect(cookies.get("refreshToken")?.value).toBe(mockRefreshToken); // Refresh token

      // Assert cookie attributes
      expect(cookies.get("accessToken")?.httpOnly).toBe(true);
      expect(cookies.get("refreshToken")?.httpOnly).toBe(true);
      expect(cookies.get("accessToken")?.sameSite).toBe("strict");
      expect(cookies.get("refreshToken")?.sameSite).toBe("strict");
    }
  });

  // Test 4: Catch errors when prisma fails
  it("should return 500 if an unexpected error occurs", async () => {
    prismaMock.user.findUnique.mockRejectedValue(new Error("Database error"));

    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com", password: "password123" }),
    });

    const response = await POST(request);

    if (response) {
      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.error).toBe("An unexpected error occurred. Please try again later.");
    }
  });

  // Test 5: Check if the user password is same as database
  it("should return 401 if the password is incorrect", async () => {
    // Mock user data
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      email: "John.Doe@example.com",
      password: "$2b$12$A9E9aX7XE8AvK8HEuCjueu67TSUlMY1H77zywsC5hh6Yx8/f/8yMO",
      firstName: "John",
      lastName: "Doe",
      createdAt: new Date("2023-01-01T00:00:00Z"),
      updatedAt: new Date("2023-11-25T10:15:00Z"),
    });

    // Mock bcrypt to return false for incorrect password
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({ email: "John.Doe@example.com", password: "wrongpassword" }),
    });

    const response = await POST(request);

    if (response) {
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.error).toBe("Invalid email or password");
    }
  });
});
