import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/axios", () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import { api } from "@/lib/axios";
import { login, getMe, refreshSession } from "@/lib/auth";
import type { User } from "@/lib/auth";

const mockPost = vi.mocked(api.post);
const mockGet = vi.mocked(api.get);

const mockUser: User = {
  id: "user-1",
  email: "user@example.com",
  name: "Test User",
  is_verified: true,
  is_resource: false,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("login", () => {
  const credentials = { email: "user@example.com", password: "password123" };

  it("posts credentials to /auth/login", async () => {
    mockPost.mockResolvedValue({ data: mockUser });

    await login(credentials);

    expect(mockPost).toHaveBeenCalledWith("/auth/login", credentials);
  });

  it("returns the user on success", async () => {
    mockPost.mockResolvedValue({ data: mockUser });

    await expect(login(credentials)).resolves.toEqual(mockUser);
  });

  it("propagates errors from the API", async () => {
    const error = new Error("Network error");
    mockPost.mockRejectedValue(error);

    await expect(login(credentials)).rejects.toThrow("Network error");
  });
});

describe("getMe", () => {
  it("requests /auth/me", async () => {
    mockGet.mockResolvedValue({ data: mockUser });

    await getMe();

    expect(mockGet).toHaveBeenCalledWith("/auth/me");
  });

  it("returns the current user", async () => {
    mockGet.mockResolvedValue({ data: mockUser });

    await expect(getMe()).resolves.toEqual(mockUser);
  });

  it("propagates errors from the API", async () => {
    const error = new Error("Unauthorized");
    mockGet.mockRejectedValue(error);

    await expect(getMe()).rejects.toThrow("Unauthorized");
  });
});

describe("refreshSession", () => {
  it("posts to /auth/refresh", async () => {
    mockPost.mockResolvedValue({ data: {} });

    await refreshSession();

    expect(mockPost).toHaveBeenCalledWith("/auth/refresh");
  });

  it("resolves without returning data", async () => {
    mockPost.mockResolvedValue({ data: {} });

    await expect(refreshSession()).resolves.toBeUndefined();
  });

  it("propagates errors from the API", async () => {
    const error = new Error("Token expired");
    mockPost.mockRejectedValue(error);

    await expect(refreshSession()).rejects.toThrow("Token expired");
  });
});
