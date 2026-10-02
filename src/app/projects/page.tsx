import type { Metadata } from "next";
import ProjectsScreen from "@/components/projects/ProjectsScreen";
export const metadata: Metadata = { title: "Projects" };
export default function ProjectsPage() { return <ProjectsScreen />; }
