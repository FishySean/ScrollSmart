import type { Metadata } from "next";
import "./globals.css";
import StarTrailBackground from "@/components/StarTrailBackground";

export const metadata: Metadata = {
  title: "ScrollSmart — AI Knowledge Feed",
  description: "Personalized AI-generated knowledge chats, TikTok-style",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen relative overflow-x-hidden bg-[#0a0c28] text-[#e8e8f0]">
        <StarTrailBackground />
        <div className="relative z-10 w-full bg-transparent">
          {children}
        </div>
      </body>
    </html>
  );
}
