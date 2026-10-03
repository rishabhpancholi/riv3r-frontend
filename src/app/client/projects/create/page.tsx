import type { Metadata } from "next";
import CreateClientProjectScreen from "@/components/client/projects/CreateClientProjectScreen";

export const metadata: Metadata = { title: "Create project" };
export default function CreateClientProjectPage() { return <CreateClientProjectScreen />; }
