import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/axios", () => ({
  api: {
    post: vi.fn(),
  },
}));

import { api } from "@/lib/axios";
import {
  onboardOrganization,
  onboardResource,
  type OrganizationOnboardingPayload,
  type ResourceOnboardingPayload,
} from "@/lib/onboarding";

const mockPost = vi.mocked(api.post);

const validPayload: OrganizationOnboardingPayload = {
  company_email: "acme@example.com",
  registered_name: "Acme Corp",
  website_url: "https://acme.example.com",
  industry: "Technology",
  org_type: "client",
  owner: {
    email: "owner@example.com",
    first_name: "Jane",
    last_name: "Doe",
    password: "StrongPass1!",
    phone_number: "+919876543210",
  },
};

const validResourcePayload: ResourceOnboardingPayload = {
  email: "jane@example.com",
  first_name: "Jane",
  last_name: "Doe",
  password: "StrongPass1!",
  phone_number: "+919876543210",
  title: "Software Engineer",
  bio: "<p>Full-stack engineer</p>",
  location: "Mumbai, India",
  skills: ["React", "Node.js"],
  experience_years: 5,
  portfolio_url: "https://portfolio.example.com",
  linked_in_url: "https://linkedin.com/in/janedoe",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("onboardOrganization", () => {
  it("posts the payload to /onboarding/organization", async () => {
    mockPost.mockResolvedValue({ data: {} });

    await onboardOrganization(validPayload);

    expect(mockPost).toHaveBeenCalledWith(
      "/onboarding/organization",
      validPayload
    );
  });

  it("resolves without returning data on success", async () => {
    mockPost.mockResolvedValue({ data: {} });

    await expect(onboardOrganization(validPayload)).resolves.toBeUndefined();
  });

  it("propagates errors from the API", async () => {
    const error = new Error("Network error");
    mockPost.mockRejectedValue(error);

    await expect(onboardOrganization(validPayload)).rejects.toThrow(
      "Network error"
    );
  });
});

describe("onboardResource", () => {
  it("posts the payload to /onboarding/resource", async () => {
    mockPost.mockResolvedValue({ data: {} });

    await onboardResource(validResourcePayload);

    expect(mockPost).toHaveBeenCalledWith(
      "/onboarding/resource",
      validResourcePayload
    );
  });

  it("resolves without returning data on success", async () => {
    mockPost.mockResolvedValue({ data: {} });

    await expect(onboardResource(validResourcePayload)).resolves.toBeUndefined();
  });

  it("propagates errors from the API", async () => {
    const error = new Error("Server error");
    mockPost.mockRejectedValue(error);

    await expect(onboardResource(validResourcePayload)).rejects.toThrow(
      "Server error"
    );
  });
});
