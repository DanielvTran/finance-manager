import { DELETE } from "@/app/api/data/category/delete-category/[id]/route";
import { NextRequest } from "next/server";
import { prismaMock } from "../../../../../lib/prismaSingleton";
import jwt from "jsonwebtoken";

/* 
    Mock module imports
    Example: Not actually connecting to MySQL database using prisma
*/

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

// Create test suite for delete category endpoint
describe("DELETE /category/delete-category/[id]", () => {
  // Setup mock environment variables
  const originalEnv = process.env;

  // Setup mock data
  const mockUserId = 1;
  const mockCategoryId = 5;

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
    // Set request to have null in cookies
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue(undefined),
      },
      url: "http://localhost/api/data/categories/delete-category/1",
    } as unknown as NextRequest;

    const response = await DELETE(mockRequest);
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
      url: "http://localhost/api/data/categories/delete-category/1",
    } as unknown as NextRequest;

    const response = await DELETE(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result).toEqual({ error: "An unexpected error occurred. Please try again later." });
  });

  it("should return 400 if no category ID is provided", async () => {
    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: mockUserId });

    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid-token" }),
      },
      url: "http://localhost/api/categories/",
    } as unknown as NextRequest;

    const response = await DELETE(mockRequest);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result).toEqual({ error: "Category ID is required" });
  });

  it("should return 404 if category does not exist for the user", async () => {
    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: mockUserId });

    // Mock Prisma to return null (category not found)
    (prismaMock.category.findFirst as jest.Mock).mockResolvedValue(null);

    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid-token" }),
      },
      url: `http://localhost/api/categories/${mockCategoryId}`,
    } as unknown as NextRequest;

    const response = await DELETE(mockRequest);
    const result = await response.json();

    expect(prismaMock.category.findFirst).toHaveBeenCalledWith({
      where: {
        id: mockCategoryId,
        userId: mockUserId,
      },
    });
    expect(response.status).toBe(404);
    expect(result).toEqual({ error: "Category not found or unauthorized" });
  });

  it("should successfully delete a category", async () => {
    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: mockUserId });

    // Mock Prisma to return existing category
    (prismaMock.category.findFirst as jest.Mock).mockResolvedValue({
      id: mockCategoryId,
      name: "Test Category",
      userId: mockUserId,
    });

    // Mock Prisma delete operation
    (prismaMock.category.delete as jest.Mock).mockResolvedValue({
      id: mockCategoryId,
      name: "Test Category",
      userId: mockUserId,
    });

    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid-token" }),
      },
      url: `http://localhost/api/categories/${mockCategoryId}`,
    } as unknown as NextRequest;

    const response = await DELETE(mockRequest);
    const result = await response.json();

    expect(prismaMock.category.findFirst).toHaveBeenCalledWith({
      where: {
        id: mockCategoryId,
        userId: mockUserId,
      },
    });
    expect(prismaMock.category.delete).toHaveBeenCalledWith({
      where: { id: mockCategoryId },
    });
    expect(response.status).toBe(200);
    expect(result).toEqual({
      message: "Category deleted successfully",
      category: {
        id: mockCategoryId,
        name: "Test Category",
        userId: mockUserId,
      },
    });
  });
});
