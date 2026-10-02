import type { Metadata } from "next";
import LoginScreen from "@/components/login/LoginScreen";
export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return <LoginScreen />;
}
