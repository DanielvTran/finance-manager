import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

// Mock the `prisma` import
jest.mock("./prisma", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

// Initialize prismaMock after jest.mock
const prismaMock = require("./prisma").prisma as DeepMockProxy<PrismaClient>;

// Reset mock before each test
beforeEach(() => {
  mockReset(prismaMock);
});

export { prismaMock };
