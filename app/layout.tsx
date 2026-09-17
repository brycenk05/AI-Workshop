import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brycen Kano",
  description: "Brycen Kano — a senior at UH Manoa studying computer science.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
