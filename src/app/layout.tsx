import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoadRescue — Operations & Dispatch Center",
  description: "Real-time dispatch controls, driver tracking, technician management, and support requests.",
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
