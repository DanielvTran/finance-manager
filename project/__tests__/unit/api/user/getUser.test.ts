import { GET } from "@/app/api/user/get-user/route";
import { NextRequest } from "next/server";
import { prismaMock } from "../../../../lib/prismaSingleton";
import jwt from "jsonwebtoken";

/* 
    Mock module imports
    Example: Not actually connecting to MySQL database using prisma
*/

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

// Create test suite for get user endpoint
describe("POST /user/get-user", () => {
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

  it("should successfully retrieve user data with valid token", async () => {
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
        get: jest.fn().mockReturnValue({ value: "valid_access_token" }),
      },
    } as unknown as NextRequest;

    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: mockUser.id });

    // Mock user lookup
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    // Mock user deletion
    (prismaMock.user.delete as jest.Mock).mockResolvedValue(mockUser);

    // Call the GET handler
    const response = await GET(mockRequest);

    // Assertions
    expect(response.status).toBe(200);

    // Verify JWT token
    expect(jwt.verify).toHaveBeenCalledWith("valid_access_token", process.env.JWT_SECRET_ACCESS);

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

    // Parse response body
    const responseBody = await response.json();

    // Verify response body matches mock user
    expect(responseBody).toEqual(mockUser);
  });

  it("should return 401 when no access token is provided", async () => {
    // Create a mock request with no token
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue(undefined),
      },
    } as unknown as NextRequest;

    // Call the GET handler
    const response = await GET(mockRequest);

    // Assertions
    expect(response.status).toBe(401);

    // Ensure no further actions were taken
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });

  it("should return 404 when user is not found", async () => {
    // Create a mock request with a token
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid_access_token" }),
      },
    } as unknown as NextRequest;

    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });

    // Mock user not found
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

    // Call the GET handler
    const response = await GET(mockRequest);

    // Assertions
    expect(response.status).toBe(404);
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

    // Call the GET handler
    const response = await GET(mockRequest);

    // Assertions
    expect(response.status).toBe(500);

    // Ensure no further actions were taken
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });

  it("should handle unexpected errors during user retrieval", async () => {
    // Create a mock request with a token
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid_access_token" }),
      },
    } as unknown as NextRequest;

    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: 1 });

    // Mock user lookup to throw an error
    (prismaMock.user.findUnique as jest.Mock).mockRejectedValue(new Error("Database error"));

    // Call the GET handler
    const response = await GET(mockRequest);

    // Assertions
    expect(response.status).toBe(500);
  });

  it("should return 500 for an expired token", async () => {
    // Create a mock request with an expired token
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "expired_token" }),
      },
    } as unknown as NextRequest;

    // Mock JWT verification to throw a TokenExpiredError
    (jwt.verify as jest.Mock).mockImplementation(() => {
      const error = new Error("Token expired");
      error.name = "TokenExpiredError";
      throw error;
    });

    // Call the GET handler
    const response = await GET(mockRequest);

    // Assertions
    expect(response.status).toBe(500);
    expect(jwt.verify).toHaveBeenCalled();
  });

  it("should return 500 for a malformed token", async () => {
    // Create a mock request with a malformed token
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "malformed_token" }),
      },
    } as unknown as NextRequest;

    // Mock JWT verification to throw a JsonWebTokenError
    (jwt.verify as jest.Mock).mockImplementation(() => {
      const error = new Error("Invalid token");
      error.name = "JsonWebTokenError";
      throw error;
    });

    // Call the GET handler
    const response = await GET(mockRequest);

    // Assertions
    expect(response.status).toBe(500);
    expect(jwt.verify).toHaveBeenCalled();
  });
});
