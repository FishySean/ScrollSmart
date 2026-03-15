"use client";

import { useRef } from "react";
import Link from "next/link";
import CosmicGalaxyUI from "@/components/CosmicGalaxyUI";

/**
 * Demo: Modern interactive cosmic galaxy UI
 * Canvas particles · drifting nebula · scroll parallax · minimal floating UI
 */
export default function GalaxyThemePage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <CosmicGalaxyUI scrollContainerRef={scrollContainerRef} />
      {/* Scrollable container so parallax works (body may have overflow:hidden) */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 h-screen overflow-y-auto overflow-x-hidden"
      >
        {/* Fullscreen galaxy + scrollable content for parallax */}
        <div className="min-h-[200vh]">
        {/* Minimal floating UI — center focal area */}
        <section className="sticky top-0 flex min-h-screen flex-col items-center justify-center px-6 py-12">
          <span className="mb-4 rounded-full border border-violet-400/50 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
            交互宇宙背景 · Canvas 粒子 + 视差
          </span>
          <h1
            className="mb-3 text-center text-4xl font-light tracking-wide text-white/95"
            style={{
              textShadow:
                "0 0 32px rgba(180,160,255,0.4), 0 0 64px rgba(140,120,240,0.25)",
            }}
          >
            Cosmic Galaxy
          </h1>
          <p className="mb-10 max-w-md text-center text-white/75">
            Dreamy nebula, moving stars, ethereal atmosphere. Scroll to feel the parallax.
          </p>

          <div
            className="mb-8 w-full max-w-sm rounded-2xl border border-white/10 p-6 backdrop-blur-xl"
            style={{
              background: "rgba(8,10,28,0.55)",
              boxShadow:
                "0 0 40px rgba(100,80,200,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <h2 className="mb-2 text-lg font-medium text-white/92">
              Futuristic · Cosmic · Dreamy
            </h2>
            <p className="text-sm text-white/65">
              Animated star particles, floating dust, drifting nebula clouds, and a soft glowing moon. Dark mode, minimal UI.
            </p>
          </div>

          <Link
            href="/onboarding"
            className="rounded-xl px-6 py-3 font-medium text-white/95 transition-all hover:scale-[1.02]"
            style={{
              background:
                "linear-gradient(135deg, rgba(100,80,220,0.5) 0%, rgba(160,120,255,0.35) 100%)",
              boxShadow: "0 0 28px rgba(140,120,240,0.35)",
            }}
          >
            Continue
          </Link>
        </section>

        {/* Spacer so page scrolls and parallax is visible */}
        <div className="flex h-screen items-center justify-center">
          <p className="text-sm text-white/50">Keep scrolling — background layers move with parallax</p>
        </div>
        </div>
      </div>
    </>
  );
}
