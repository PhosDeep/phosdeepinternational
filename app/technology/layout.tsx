import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technology Domains | Phosdeep International",
  description: "Explore Phosdeep technology domains across cybersecurity, AI, quantum, cloud, blockchain and research.",
};

export default function TechnologyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
