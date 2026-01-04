import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Examynex",
  description: "Online assessments with calm precision",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),_transparent_55%)]" />
        <div className="relative z-10 min-h-screen pb-16">{children}</div>
      </body>
    </html>
  );
}
