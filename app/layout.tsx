import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Werk Insights",
  description: "Generated dance business insights dashboard",
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
