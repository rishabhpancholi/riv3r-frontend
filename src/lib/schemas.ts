import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const PASSWORD_RULES = [
  {
    key: "minLength",
    label: "At least 8 characters",
    test: (value: string) => value.length >= 8,
  },
  {
    key: "uppercase",
    label: "At least one uppercase letter (A-Z)",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    key: "lowercase",
    label: "At least one lowercase letter (a-z)",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    key: "number",
    label: "At least one number (0-9)",
    test: (value: string) => /\d/.test(value),
  },
  {
    key: "special",
    label:
      "At least one special character (!@#$%^&*()-_=+[]{};:,<.>/?\\)",
    test: (value: string) =>
      /[!@#$%^&*()\-_=+\[\]{};:,<.>/?\\]/.test(value),
  },
] as const;

export type PasswordRule = (typeof PASSWORD_RULES)[number];

function getEmailDomain(email: string): string {
  return email.split("@")[1]?.trim().toLowerCase() ?? "";
}

export const organizationOnboardingSchema = z
  .object({
    company_email: z
      .string()
      .min(1, "Company email is required")
      .email("Enter a valid company email address"),
    registered_name: z.string().min(1, "Registered name is required"),
    website_url: z
      .string()
      .refine(
        (value) =>
          value.trim() === "" ||
          z.string().url().safeParse(value.trim()).success,
        { message: "Enter a valid website URL" }
      ),
    industry: z.string().min(1, "Industry is required"),
    org_type: z.enum(["client", "agency"]),
    owner: z.object({
      email: z
        .string()
        .min(1, "Owner email is required")
        .email("Enter a valid email address"),
      first_name: z.string().min(1, "First name is required"),
      last_name: z.string().min(1, "Last name is required"),
      password: z
        .string()
        .min(1, "Password is required")
        .refine(
          (value) => PASSWORD_RULES.every((rule) => rule.test(value)),
          { message: "Password does not meet all requirements" }
        ),
      country_code: z.string().min(1, "Country code is required"),
      phone_number: z
        .string()
        .refine(
          (value) =>
            value.trim() === "" || /^\d{10}$/.test(value.trim()),
          { message: "Enter a valid 10-digit phone number" }
        ),
    }),
  })
  .refine(
    (data) => getEmailDomain(data.company_email) === getEmailDomain(data.owner.email),
    {
      message: "Company email and owner email must be from the same domain",
      path: ["owner", "email"],
    }
  );

export type OrganizationOnboardingFormValues = z.infer<
  typeof organizationOnboardingSchema
>;

export const resourceOnboardingSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .refine(
        (value) => PASSWORD_RULES.every((rule) => rule.test(value)),
        { message: "Password does not meet all requirements" }
      ),
    country_code: z.string().min(1, "Country code is required"),
    phone_number: z.string().refine(
      (value) => value.trim() === "" || /^\d{10}$/.test(value.trim()),
      { message: "Enter a valid 10-digit phone number" }
    ),
    title: z.string().min(1, "Title is required"),
    bio: z.string(),
    location: z.string(),
    skills: z.array(z.string().min(1)).min(1, "Add at least one skill"),
    experience_years: z
      .string()
      .min(1, "Experience years is required")
      .regex(/^\d+$/, "Enter a valid number"),
    portfolio_url: z.string().refine(
      (value) =>
        value.trim() === "" ||
        z.string().url().safeParse(value.trim()).success,
      { message: "Enter a valid portfolio URL" }
    ),
    linked_in_url: z.string().refine(
      (value) =>
        value.trim() === "" ||
        z.string().url().safeParse(value.trim()).success,
      { message: "Enter a valid LinkedIn URL" }
    ),
  })
  .refine(
    (data) =>
      data.portfolio_url.trim() === "" ||
      data.linked_in_url.trim() === "" ||
      data.portfolio_url.trim() !== data.linked_in_url.trim(),
    {
      message: "Portfolio URL and LinkedIn URL cannot be the same",
      path: ["linked_in_url"],
    }
  );

export type ResourceOnboardingFormValues = z.infer<
  typeof resourceOnboardingSchema
>;
