import { POST } from "@/app/api/data/category/create-category/route";
import { NextRequest } from "next/server";
import { prismaMock } from "../../../../../lib/prismaSingleton";
import jwt from "jsonwebtoken";

/* 
    Mock module imports
    Example: Not actually connecting to MySQL database using prisma
*/

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

// Create test suite for create category endpoint
describe("POST /category/create-category", () => {
  // Setup mock environment variables
  const originalEnv = process.env;

  // Setup mock data
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

  it("should return 401 if no token is provided", async () => {
    // Set request to have null in cookies
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue(undefined),
      },
      url: "http://localhost/api/data/categories/create-category",
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(401);
    expect(result).toEqual({ error: "Unauthorized" });
  });

  it("should return 500 for invalid token", async () => {
    // Mock JWT verification to throw an error
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "invalid-token" }),
      },
      url: "http://localhost/api/data/categories/create-category",
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result).toEqual({ error: "An unexpected error occurred. Please try again later." });
  });

  it("should return 400 if no category name is provided", async () => {
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid-token" }),
      },
      json: jest.fn().mockResolvedValue({
        description: "Test Description",
      }),
    } as unknown as NextRequest;

    (jwt.verify as jest.Mock).mockReturnValue({ id: mockUserId });

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: "Category name is required" });
  });

  it("should return 400 if category name already exists for the user", async () => {
    const mockBody = {
      name: "Existing Category",
      description: "Test Category Description",
    };
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid-token" }),
      },
      json: jest.fn().mockResolvedValue(mockBody),
    } as unknown as NextRequest;

    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: mockUserId });

    // Mock Prisma findFirst to return an existing category
    const existingCategory = {
      id: 1,
      name: mockBody.name,
      userId: mockUserId,
    };
    (prismaMock.category.findFirst as jest.Mock).mockResolvedValue(existingCategory);

    const response = await POST(mockRequest);

    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: "Category already exists for this user" });
  });

  it("should successfully create a category", async () => {
    const mockBody = {
      name: "New category",
    };

    // Mock request
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid-token" }),
      },
      json: jest.fn().mockResolvedValue(mockBody),
    } as unknown as NextRequest;

    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: mockUserId });

    // Mock Prisma findFirst to return null (no existing category)
    (prismaMock.category.findFirst as jest.Mock).mockResolvedValue(null);

    // Mock Prisma create operation
    const newCategory = {
      id: 1,
      name: mockBody.name,
      userId: mockUserId,
    };
    (prismaMock.category.create as jest.Mock).mockResolvedValue(newCategory);

    const response = await POST(mockRequest);
    const result = await response.json();

    // Verify Prisma method calls
    expect(prismaMock.category.findFirst).toHaveBeenCalledWith({
      where: {
        name: mockBody.name,
        userId: mockUserId,
      },
    });
    expect(prismaMock.category.create).toHaveBeenCalledWith({
      data: {
        name: mockBody.name,
        userId: mockUserId,
      },
    });

    // Check response
    expect(response.status).toBe(201);
    expect(result).toEqual(newCategory);
  });
});
