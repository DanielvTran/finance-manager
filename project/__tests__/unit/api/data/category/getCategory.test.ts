import { GET } from "@/app/api/data/category/get-category/route";
import { NextRequest } from "next/server";
import { prismaMock } from "../../../../../lib/prismaSingleton";
import jwt from "jsonwebtoken";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("GET /category/get-category", () => {
  const originalEnv = process.env;
  const mockUserId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      JWT_SECRET_ACCESS: "test_jwt_secret",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should successfully retrieve categories with valid token", async () => {
    // Mock categories data
    const mockCategories = [
      {
        id: 1,
        name: "Rent",
        description: "Rent expenses",
        userId: mockUserId,
      },
      {
        id: 2,
        name: "Utilities",
        description: "Utility bills",
        userId: mockUserId,
      },
    ];

    // Create a mock request with a token in cookies
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid_access_token" }),
      },
    } as unknown as NextRequest;

    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: mockUserId });

    // Mock categories lookup
    (prismaMock.category.findMany as jest.Mock).mockResolvedValue(mockCategories);

    // Call the GET handler
    const response = await GET(mockRequest);

    // Assertions
    expect(response.status).toBe(200);

    // Verify JWT token
    expect(jwt.verify).toHaveBeenCalledWith("valid_access_token", process.env.JWT_SECRET_ACCESS);

    // Verify categories lookup
    expect(prismaMock.category.findMany).toHaveBeenCalledWith({
      where: { userId: mockUserId },
      select: {
        id: true,
        name: true,
      },
    });

    // Parse response body
    const responseBody = await response.json();

    // Verify response body matches mock categories
    expect(responseBody).toEqual(mockCategories);
  });

  it("should return 404 when no categories are found for the user", async () => {
    // Create a mock request with a token
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid_access_token" }),
      },
    } as unknown as NextRequest;

    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: mockUserId });

    // Mock empty categories array
    (prismaMock.category.findMany as jest.Mock).mockResolvedValue([]);

    // Call the GET handler
    const response = await GET(mockRequest);

    // Assertions
    expect(response.status).toBe(404);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: "No categories found for the user" });
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
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: "Unauthorized" });

    // Ensure no further actions were taken
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(prismaMock.category.findMany).not.toHaveBeenCalled();
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
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: "An unexpected error occurred. Please try again later." });

    // Ensure no further actions were taken
    expect(prismaMock.category.findMany).not.toHaveBeenCalled();
  });
});
