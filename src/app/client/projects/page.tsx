import type { Metadata } from "next";
import ClientProjectsScreen from "@/components/client/projects/ClientProjectsScreen";

export const metadata: Metadata = { title: "Projects" };
export default function ClientProjectsPage() { return <ClientProjectsScreen />; }
