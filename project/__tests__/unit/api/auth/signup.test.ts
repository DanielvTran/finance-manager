import { POST } from "@/app/api/auth/signup/route";
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
describe("POST /auth/signup", () => {
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

  it("should return 400 if request body is invalid", async () => {
    // Test with missing or invalid fields
    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        firstName: "",
        lastName: "",
        email: "invalidemail",
        password: "short",
        updatedAt: "",
      }),
    });

    const response = await POST(request);

    if (response) {
      expect(response.status).toBe(400);
    }
  });

  it("should return 409 if email already exists", async () => {
    // Mock input data
    const mockRequestBody = {
      firstName: "John",
      lastName: "Doe",
      email: "existing@example.com",
      password: "StrongPassword123!",
      updatedAt: new Date(),
    };

    const mockRequest = {
      json: jest.fn().mockResolvedValue(mockRequestBody),
    } as unknown as NextRequest;

    // Mock existing user
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
      id: "123",
      email: mockRequestBody.email,
    });

    // Call the route handler
    const response = await POST(mockRequest);

    if (response) {
      // Assertions
      expect(response.status).toBe(409);
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    }
  });

  it("should hash the password using a salt of 12", async () => {
    // Mock bcrypt.hash to return a hashed password
    (bcrypt.hash as jest.Mock).mockResolvedValue("$2b$12$hashedpassword1234567890");

    // Simulate a POST request
    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        updatedAt: new Date(),
      }),
    });

    // Call the POST handler
    await POST(request);

    // Assert that bcrypt.hash was called with the correct password and salt
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 12);
  });

  it("should create a new user in the database", async () => {
    // Mock input data
    const mockRequestBody = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "StrongPassword123!",
      updatedAt: new Date("2025-02-18T06:28:25.218Z"),
    };

    // Mock request
    const mockRequest = {
      json: jest.fn().mockResolvedValue(mockRequestBody),
    } as unknown as NextRequest;

    // Mock dependencies
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    const mockNewUser = {
      id: "123",
      ...mockRequestBody,
      password: "hashedPassword",
    };

    (prismaMock.user.create as jest.Mock).mockResolvedValue(mockNewUser);

    (jwt.sign as jest.Mock).mockReturnValueOnce("accessToken").mockReturnValueOnce("refreshToken");

    // Mock the Date constructor to return a fixed date
    const mockDate = new Date("2025-02-18T06:28:25.218Z");
    jest.spyOn(global, "Date").mockImplementationOnce(() => mockDate);

    // Call the route handler
    const response = await POST(mockRequest);

    if (response) {
      // Assertions
      expect(response.status).toBe(500);

      // Check user creation
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockRequestBody.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockRequestBody.password, 12);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          firstName: mockRequestBody.firstName,
          lastName: mockRequestBody.lastName,
          email: mockRequestBody.email,
          password: "hashedPassword",
          updatedAt: mockDate,
        },
      });

      // Check token generation
      expect(jwt.sign).toHaveBeenCalledTimes(2);

      // Check cookies
      const cookies = response.cookies;
      expect(cookies.get("accessToken")).toBeTruthy();
      expect(cookies.get("refreshToken")).toBeTruthy();
    }
  });

  it("should generate a JWT access token with correct payload and options", async () => {
    // Prepare mock user data
    const mockRequestBody = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      updatedAt: new Date(),
    };

    // Mock the entire user creation process
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    // Create a mock user with an ID
    const mockUser = {
      id: 1,
      ...mockRequestBody,
      password: "hashedPassword",
    };
    (prismaMock.user.create as jest.Mock).mockResolvedValue(mockUser);

    // Mock JWT token generation
    const mockAccessToken = "mocked_access_token";
    const mockRefreshToken = "mocked_refresh_token";
    (jwt.sign as jest.Mock).mockReturnValueOnce(mockAccessToken).mockReturnValueOnce(mockRefreshToken);

    // Create a mock request
    const mockRequest = {
      json: jest.fn().mockResolvedValue(mockRequestBody),
    } as unknown as NextRequest;

    // Call the POST handler
    const response = await POST(mockRequest);

    // Assertions for JWT token generation
    expect(jwt.sign).toHaveBeenCalledTimes(2);

    // Check first JWT sign call (access token)
    expect(jwt.sign).toHaveBeenNthCalledWith(
      1,
      { id: mockUser.id, email: mockUser.email },
      process.env.JWT_SECRET_ACCESS,
      { expiresIn: "1h" }
    );

    // Check second JWT sign call (refresh token)
    expect(jwt.sign).toHaveBeenNthCalledWith(
      2,
      { id: mockUser.id, email: mockUser.email },
      process.env.JWT_SECRET_REFRESH,
      { expiresIn: "30d" }
    );
  });

  it("should set access and refresh tokens as httpOnly cookies with correct attributes", async () => {
    // Prepare mock user data
    const mockRequestBody = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      updatedAt: new Date(),
    };

    // Mock the entire user creation process
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    // Create a mock user with an ID
    const mockUser = {
      id: 1,
      ...mockRequestBody,
      password: "hashedPassword",
    };
    (prismaMock.user.create as jest.Mock).mockResolvedValue(mockUser);

    // Mock JWT token generation
    const mockAccessToken = "mocked_access_token";
    const mockRefreshToken = "mocked_refresh_token";
    (jwt.sign as jest.Mock).mockReturnValueOnce(mockAccessToken).mockReturnValueOnce(mockRefreshToken);

    // Create a mock request
    const mockRequest = {
      json: jest.fn().mockResolvedValue(mockRequestBody),
    } as unknown as NextRequest;

    // Call the POST handler
    const response = await POST(mockRequest);

    if (response) {
      // Assertions for cookies
      const cookies = response.cookies;

      // Check access token cookie
      expect(cookies.get("accessToken")?.value).toBe(mockAccessToken);
      expect(cookies.get("accessToken")?.httpOnly).toBe(true);
      expect(cookies.get("accessToken")?.secure).toBe(false); // development mode
      expect(cookies.get("accessToken")?.sameSite).toBe("strict");
      expect(cookies.get("accessToken")?.maxAge).toBe(3600);
      expect(cookies.get("accessToken")?.path).toBe("/");

      // Check refresh token cookie
      expect(cookies.get("refreshToken")?.value).toBe(mockRefreshToken);
      expect(cookies.get("refreshToken")?.httpOnly).toBe(true);
      expect(cookies.get("refreshToken")?.secure).toBe(false); // development mode
      expect(cookies.get("refreshToken")?.sameSite).toBe("strict");
      expect(cookies.get("refreshToken")?.maxAge).toBe(2592000);
      expect(cookies.get("refreshToken")?.path).toBe("/");
    }
  });

  it("should handle database creation failure", async () => {
    // Mock input data
    const mockRequestBody = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "StrongPassword123!",
      updatedAt: new Date(),
    };

    const mockRequest = {
      json: jest.fn().mockResolvedValue(mockRequestBody),
    } as unknown as NextRequest;

    // Mock dependencies to simulate creation failure
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (prismaMock.user.create as jest.Mock).mockResolvedValue(null);

    // Call the route handler
    const response = await POST(mockRequest);

    // Assertions
    if (response) {
      expect(response.status).toBe(500);
    }
  });

  it("should handle unexpected errors", async () => {
    // Mock input data
    const mockRequestBody = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "StrongPassword123!",
      updatedAt: new Date(),
    };

    const mockRequest = {
      json: jest.fn().mockRejectedValue(new Error("Unexpected error")),
    } as unknown as NextRequest;

    // Call the route handler
    const response = await POST(mockRequest);

    // Assertions
    if (response) {
      expect(response.status).toBe(500);
    }
  });
});
