import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased bg-[#0a0a1a] text-[#e8e8f0] h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
