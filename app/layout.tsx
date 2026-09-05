import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {

  title:
    "Phosdeep International | Technology, Training & Innovation",

  description:
    "Phosdeep International is a technology company working across Cybersecurity, AI, Generative AI, Quantum Computing, Blockchain, Cloud and emerging technologies.",

  keywords: [
    "Phosdeep International",
    "Artificial Intelligence",
    "Generative AI",
    "Cybersecurity",
    "Quantum Computing",
    "Blockchain",
    "Cloud Computing",
    "Machine Learning",
    "Technology Training",
    "Technology Consulting",
  ],

  authors: [
    {
      name: "Phosdeep International",
    },
  ],

  creator:
    "Phosdeep International",

  publisher:
    "Phosdeep International",

  metadataBase:
    new URL(
      "https://phosdeepinternational.com"
    ),

  openGraph: {

    title:
      "Phosdeep International | Technology, Training & Innovation",

    description:
      "Building technology and developing the people capable of working with it.",

    siteName:
      "Phosdeep International",

    type: "website",

  },

  twitter: {

    card: "summary_large_image",

    title:
      "Phosdeep International | Technology, Training & Innovation",

    description:
      "Technology, training and innovation across Cybersecurity, AI, Quantum, Blockchain, Cloud and emerging technologies.",

  },

};


export default function RootLayout({
  children,
}: LayoutProps<"/">) {

  return (

    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col">

        {children}

      </body>

    </html>

  );
}