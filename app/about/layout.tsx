import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Phosdeep International",
  description: "Learn how Phosdeep connects emerging technology, practical training and applied innovation.",
};

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
