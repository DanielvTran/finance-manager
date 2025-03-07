import { DELETE } from "@/app/api/user/delete-user/route";
import { NextRequest } from "next/server";
import { prismaMock } from "../../../../lib/prismaSingleton";
import jwt from "jsonwebtoken";

/* 
    Mock module imports
    Example: Not actually connecting to MySQL database using prisma
*/

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

// Create test suite for delete user endpoint
describe("POST /user/delete-user", () => {
  // Setup mock environment variables
  const originalEnv = process.env;

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

  it("should successfully delete a user when valid token is provided", async () => {
    // Mock user data
    const mockUser = {
      id: 1,
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
    };

    // Create a mock request with a token in cookies
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid_token" }),
      },
    } as unknown as NextRequest;

    // Mock JWT verification to return decoded data directly
    const mockJwtVerify = jest.fn().mockReturnValue({ id: mockUser.id });
    jwt.verify = mockJwtVerify;

    // Mock user lookup
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    // Mock user deletion
    (prismaMock.user.delete as jest.Mock).mockResolvedValue(mockUser);

    // Call the DELETE handler
    const response = await DELETE(mockRequest);

    // Assertions
    expect(response.status).toBe(200);

    // Verify JWT token
    expect(mockJwtVerify).toHaveBeenCalledWith("valid_token", expect.anything()); // Expecting any secret here

    // Verify user lookup
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    // Verify user deletion
    expect(prismaMock.user.delete).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    // Check response cookies (should be expired)
    const cookies = response.cookies;
    expect(cookies.get("accessToken")?.value).toBe("");
    expect(cookies.get("accessToken")?.maxAge).toBe(0);
    expect(cookies.get("refreshToken")?.value).toBe("");
    expect(cookies.get("refreshToken")?.maxAge).toBe(0);
  });

  it("should return 401 when no token is provided", async () => {
    // Create a mock request with no token
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue(undefined),
      },
    } as unknown as NextRequest;

    // Call the DELETE handler
    const response = await DELETE(mockRequest);

    // Assertions
    expect(response.status).toBe(401);

    // Ensure no further actions were taken
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.user.delete).not.toHaveBeenCalled();
  });

  it("should return 404 when user is not found", async () => {
    // Create a mock request with a token
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid_token" }),
      },
    } as unknown as NextRequest;

    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });

    // Mock user not found
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

    // Call the DELETE handler
    const response = await DELETE(mockRequest);

    // Assertions
    expect(response.status).toBe(404);

    // Ensure user deletion was not attempted
    expect(prismaMock.user.delete).not.toHaveBeenCalled();
  });

  it("should return 500 when token verification fails", async () => {
    // Create a mock request with a token
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "invalid_token" }),
      },
    } as unknown as NextRequest;

    // Mock JWT verification to throw an error
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    // Call the DELETE handler
    const response = await DELETE(mockRequest);

    // Assertions
    expect(response.status).toBe(500);

    // Ensure no further actions were taken
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.user.delete).not.toHaveBeenCalled();
  });

  it("should handle unexpected errors during user deletion", async () => {
    // Create a mock request with a token
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid_token" }),
      },
    } as unknown as NextRequest;

    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });

    // Mock user lookup
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      email: "john.doe@example.com",
    });

    // Mock user deletion to throw an error
    (prismaMock.user.delete as jest.Mock).mockRejectedValue(new Error("Database error"));

    // Call the DELETE handler
    const response = await DELETE(mockRequest);

    // Assertions
    expect(response.status).toBe(500);
  });
});
