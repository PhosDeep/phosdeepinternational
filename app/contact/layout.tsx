import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Phosdeep International",
  description: "Start a conversation about technology, consulting, training or research with Phosdeep International.",
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
