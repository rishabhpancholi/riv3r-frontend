import type { Metadata } from "next";
import CreateProjectScreen from "@/components/projects/CreateProjectScreen";
export const metadata: Metadata = { title: "Create project" };
export default function CreateProjectPage() { return <CreateProjectScreen />; }
