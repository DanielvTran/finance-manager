import { POST } from "@/app/api/user/update-user/route";
import { NextRequest } from "next/server";
import { prismaMock } from "../../../../lib/prismaSingleton";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/* 
    Mock module imports
    Example: Not actually connecting to MySQL database using prisma
*/

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

// Create test suite for update user endpoint
describe("POST /user/update-user", () => {
  // Setup mock environment variables
  const originalEnv = process.env;

  // Setup existing user for mocks
  const existingUser = {
    id: 1,
    email: "original@example.com",
    firstName: "John",
    lastName: "Doe",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      JWT_SECRET: "test_jwt_secret",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return 401 if no token is provided", async () => {
    const mockReq = {
      cookies: {
        get: jest.fn().mockReturnValue(undefined),
      },
      json: jest.fn().mockResolvedValue({}),
    } as unknown as NextRequest;

    const response = await POST(mockReq);
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result).toEqual({ error: "Unauthorized: No token provided" });
  });

  it("should return 404 if user is not found", async () => {
    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });

    // Mock Prisma to return null for user
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

    const mockReq = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid-token" }),
      },
      json: jest.fn().mockResolvedValue({
        email: "newemail@example.com",
      }),
    } as unknown as NextRequest;

    const response = await POST(mockReq);
    const result = await response.json();

    expect(response.status).toBe(404);
    expect(result).toEqual({ error: "User not found" });
  });

  it("should return 500 for invalid token", async () => {
    // Mock JWT verification to throw an error
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const mockReq = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "invalid-token" }),
      },
      json: jest.fn().mockResolvedValue({}),
    } as unknown as NextRequest;

    const response = await POST(mockReq);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result).toEqual({ error: "An unexpected error occurred. Please try again later." });
  });

  it("should successfully update user email", async () => {
    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });

    // Mock Prisma to return existing user
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

    // Mock Prisma update
    const updatedUser = { ...existingUser, email: "new@example.com" };
    (prismaMock.user.update as jest.Mock).mockResolvedValue(updatedUser);

    const mockReq = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid-token" }),
      },
      json: jest.fn().mockResolvedValue({
        email: "new@example.com",
      }),
    } as unknown as NextRequest;

    const response = await POST(mockReq);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(updatedUser);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        email: "new@example.com",
        password: undefined,
        firstName: undefined,
        lastName: undefined,
      },
    });
  });

  it("should successfully update user password", async () => {
    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });

    // Mock Prisma to return existing user
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

    // Mock bcrypt hash
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    // Mock Prisma update
    const updatedUser = { ...existingUser, password: "hashedPassword" };
    (prismaMock.user.update as jest.Mock).mockResolvedValue(updatedUser);

    const mockReq = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid-token" }),
      },
      json: jest.fn().mockResolvedValue({
        password: "newpassword",
      }),
    } as unknown as NextRequest;

    const response = await POST(mockReq);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(bcrypt.hash).toHaveBeenCalledWith("newpassword", 12);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        email: undefined,
        password: "hashedPassword",
        firstName: undefined,
        lastName: undefined,
      },
    });
  });

  it("should successfully update user names", async () => {
    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });

    // Mock Prisma to return existing user
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

    // Mock Prisma update
    const updatedUser = {
      ...existingUser,
      firstName: "Jane",
      lastName: "Smith",
    };
    (prismaMock.user.update as jest.Mock).mockResolvedValue(updatedUser);

    const mockReq = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid-token" }),
      },
      json: jest.fn().mockResolvedValue({
        firstName: "Jane",
        lastName: "Smith",
      }),
    } as unknown as NextRequest;

    const response = await POST(mockReq);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(updatedUser);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        email: undefined,
        password: undefined,
        firstName: "Jane",
        lastName: "Smith",
      },
    });
  });

  it("should handle partial updates correctly", async () => {
    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });

    // Mock Prisma to return existing user
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

    // Mock Prisma update
    const updatedUser = {
      ...existingUser,
      firstName: "Jane",
    };
    (prismaMock.user.update as jest.Mock).mockResolvedValue(updatedUser);

    const mockReq = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid-token" }),
      },
      json: jest.fn().mockResolvedValue({
        firstName: "Jane",
      }),
    } as unknown as NextRequest;

    const response = await POST(mockReq);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(updatedUser);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        email: undefined,
        password: undefined,
        firstName: "Jane",
        lastName: undefined,
      },
    });
  });
});
