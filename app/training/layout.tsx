import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technology Training | Phosdeep International",
  description: "Practical, industry-driven training in AI, cybersecurity, data science, cloud and emerging technologies.",
};

export default function TrainingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
