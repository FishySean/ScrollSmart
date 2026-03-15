import type { Metadata } from "next";
import "./globals.css";
import StarTrailBackground from "@/components/StarTrailBackground";

export const metadata: Metadata = {
  title: "ScrollSmart",
  description: "Your intelligent scrolling assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen relative overflow-x-hidden bg-[#0a0c28]">
        {/* 长曝光星轨背景：同心圆绕天极旋转 + 湖面 + 湖心树影 + 远山，全站沿用 */}
        <StarTrailBackground />

        <div className="relative z-10 w-full bg-transparent">
          {children}
        </div>
      </body>
    </html>
  );
}
