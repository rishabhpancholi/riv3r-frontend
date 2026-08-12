import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  withCredentials: true,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; detail?: string }
      | undefined;

    if (data) {
      return data.detail || data.message || error.message;
    }

    if (error.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }

    return error.message;
  }

  return error instanceof Error ? error.message : "Something went wrong";
}

export function isUnauthorizedError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}
