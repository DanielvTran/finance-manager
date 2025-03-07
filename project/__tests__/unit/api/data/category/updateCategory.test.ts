import { PUT } from "@/app/api/data/category/update-category/[id]/route";
import { NextRequest } from "next/server";
import { prismaMock } from "../../../../../lib/prismaSingleton";
import jwt from "jsonwebtoken";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("PUT /category/update-category/[id]", () => {
  const originalEnv = process.env;
  const mockUserId = 1;
  const mockCategoryId = 1;

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
    // Create a mock request with no token
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue(undefined),
      },
      url: `http://localhost/api/data/category/update-category/${mockCategoryId}`,
      json: jest.fn().mockResolvedValue({}),
    } as unknown as NextRequest;

    const response = await PUT(mockRequest);

    expect(response.status).toBe(401);
    const result = await response.json();
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
      url: `http://localhost/api/data/category/update-category/${mockCategoryId}`,
      json: jest.fn().mockResolvedValue({}),
    } as unknown as NextRequest;

    const response = await PUT(mockRequest);

    expect(response.status).toBe(500);
    const result = await response.json();
    expect(result).toEqual({ error: "An unexpected error occurred. Please try again later." });
  });

  it("should return 400 if no category name is provided", async () => {
    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid-token" }),
      },
      url: `http://localhost/api/data/category/update-category/${mockCategoryId}`,
      json: jest.fn().mockResolvedValue({
        description: "Updated Description",
      }),
    } as unknown as NextRequest;

    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: mockUserId });

    const response = await PUT(mockRequest);

    expect(response.status).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: "Category name is required" });
  });

  it("should return 404 if category does not exist or user is unauthorized", async () => {
    const mockBody = {
      name: "Updated Category",
    };

    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid-token" }),
      },
      url: `http://localhost/api/data/category/update-category/${mockCategoryId}`,
      json: jest.fn().mockResolvedValue(mockBody),
    } as unknown as NextRequest;

    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: mockUserId });

    // Mock Prisma findFirst to return null (no existing category)
    (prismaMock.category.findFirst as jest.Mock).mockResolvedValue(null);

    const response = await PUT(mockRequest);

    expect(response.status).toBe(404);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ error: "Category not found or unauthorized access" });
  });

  it("should successfully update a category", async () => {
    const mockBody = {
      name: "Updated Category",
    };

    const mockRequest = {
      cookies: {
        get: jest.fn().mockReturnValue({ value: "valid-token" }),
      },
      url: `http://localhost/api/data/category/update-category/${mockCategoryId}`,
      json: jest.fn().mockResolvedValue(mockBody),
    } as unknown as NextRequest;

    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: mockUserId });

    // Mock existing category
    const existingCategory = {
      id: mockCategoryId,
      name: "Original Category",
      userId: mockUserId,
    };
    (prismaMock.category.findFirst as jest.Mock).mockResolvedValue(existingCategory);

    // Mock category update operation
    const updatedCategory = {
      id: mockCategoryId,
      name: mockBody.name,
      userId: mockUserId,
    };
    (prismaMock.category.update as jest.Mock).mockResolvedValue(updatedCategory);

    const response = await PUT(mockRequest);
    const result = await response.json();

    // Verify Prisma method calls
    expect(prismaMock.category.findFirst).toHaveBeenCalledWith({
      where: {
        id: mockCategoryId,
        userId: mockUserId,
      },
    });
    expect(prismaMock.category.update).toHaveBeenCalledWith({
      where: { id: mockCategoryId },
      data: {
        name: mockBody.name,
      },
    });

    // Check response
    expect(response.status).toBe(201);
    expect(result).toEqual(updatedCategory);
  });
});
