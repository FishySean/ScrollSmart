"use client";

import { useEffect, useRef, useState } from "react";

const STAR_COUNT = 200;
const DUST_COUNT = 120;

type CosmicGalaxyUIProps = {
  /** Optional: ref to scroll container for parallax. If not set, uses window scroll. */
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  baseOpacity: number;
  twinklePhase: number;
  twinkleSpeed: number;
  type: "star" | "dust";
};

/**
 * Modern interactive cosmic galaxy UI
 * Canvas particles (stars + dust) · drifting nebula · scroll parallax · glowing moon
 * Futuristic, dreamy, minimal dark UI
 */
export default function CosmicGalaxyUI({ scrollContainerRef }: CosmicGalaxyUIProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Scroll-based parallax: use container scroll or window
  useEffect(() => {
    const el = scrollContainerRef?.current;
    if (el) {
      const onScroll = () => setScrollY(el.scrollTop);
      onScroll(); // initial
      el.addEventListener("scroll", onScroll, { passive: true });
      return () => el.removeEventListener("scroll", onScroll);
    }
    const onScroll = () => setScrollY(window.scrollY ?? document.documentElement.scrollTop);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollContainerRef]);

  // Canvas: star + dust particles with requestAnimationFrame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId: number;

    const particles: Particle[] = [];

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.28,
          radius: 0.8 + Math.random() * 1.8,
          baseOpacity: 0.6 + Math.random() * 0.4,
          opacity: 0.7,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.025 + Math.random() * 0.04,
          type: "star",
        });
      }
      for (let i = 0; i < DUST_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.14,
          radius: 0.3 + Math.random() * 0.7,
          baseOpacity: 0.2 + Math.random() * 0.25,
          opacity: 0.25,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.015 + Math.random() * 0.025,
          type: "dust",
        });
      }
    };

    const drawParticle = (p: Particle) => {
      const isStar = p.type === "star";
      const glowRadius = isStar ? p.radius * 10 : p.radius * 6;
      const gradient = ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, glowRadius
      );
      const alpha = p.opacity * (isStar ? 0.55 : 0.35);
      gradient.addColorStop(0, isStar ? `rgba(255,255,255,${alpha})` : `rgba(230,220,255,${alpha})`);
      gradient.addColorStop(0.35, isStar ? `rgba(210,190,255,${alpha * 0.4})` : `rgba(200,190,255,${alpha * 0.3})`);
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = isStar ? `rgba(255,252,255,${p.opacity})` : `rgba(245,238,255,${p.opacity * 0.9})`;
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.001;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
        p.opacity = p.baseOpacity * (0.7 + 0.3 * Math.sin(time * p.twinkleSpeed * 60 + p.twinklePhase));
        drawParticle(p);
      }
      animationId = requestAnimationFrame(animate);
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    resize();
    animate();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const parallax = scrollY * 0.5;
  const parallaxNebula = scrollY * 0.35;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* 1. Base: deep space (midnight / navy blue) */}
      <div
        className="absolute inset-0 transition-transform duration-150"
        style={{
          background:
            "linear-gradient(180deg, #050714 0%, #080c20 20%, #060a1c 50%, #040810 100%)",
          transform: `translateY(${parallax * 0.5}px)`,
        }}
      />

      {/* 2. Nebula clouds — marble-like, indigo / violet / pastel pink — gentle drift */}
      <div
        className="absolute inset-0 transition-transform duration-150"
        style={{ transform: `translateY(${parallaxNebula}px)` }}
      >
        <div
          className="absolute inset-0 nebula-drift"
          style={{
            filter: "url(#cosmic-nebula-swirl)",
            mixBlendMode: "screen",
            opacity: 0.9,
            background: [
            "radial-gradient(ellipse 75% 60% at 50% 45%, rgba(88,80,180,0.4) 0%, rgba(100,70,200,0.18) 40%, transparent 65%)",
            "radial-gradient(ellipse 55% 70% at 32% 52%, rgba(180,130,230,0.32) 0%, rgba(140,100,220,0.12) 45%, transparent 68%)",
            "radial-gradient(ellipse 65% 55% at 68% 38%, rgba(255,200,230,0.28) 0%, rgba(250,170,220,0.1) 42%, transparent 65%)",
            "radial-gradient(ellipse 50% 50% at 22% 32%, rgba(70,90,200,0.24) 0%, transparent 55%)",
            "radial-gradient(ellipse 48% 52% at 78% 58%, rgba(190,150,255,0.22) 0%, transparent 52%)",
            "conic-gradient(from 180deg at 50% 50%, rgba(120,100,220,0.18) 0deg, rgba(255,190,230,0.14) 100deg, rgba(90,110,230,0.16) 220deg, rgba(170,140,255,0.14) 300deg)",
          ].join(", "),
            backgroundSize: "100% 100%",
          }}
        />
      </div>

      {/* SVG filter for nebula swirl */}
      <svg className="absolute w-0 h-0" aria-hidden>
        <defs>
          <filter id="cosmic-nebula-swirl" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.035 0.045"
              numOctaves="5"
              seed="4"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.035 0.045;0.04 0.05;0.032 0.042;0.035 0.045"
                dur="30s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="24"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* 3. Soft glowing highlights (ethereal) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 42%, rgba(160,140,255,0.1) 0%, transparent 55%)",
          mixBlendMode: "screen",
        }}
      />

      {/* 4. Canvas: animated star + dust particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ display: "block" }}
      />

      {/* 5. Large glowing moon / light — center focal point */}
      <div
        className="absolute left-1/2 top-[42%] rounded-full pointer-events-none"
        style={{
          width: "clamp(100px, 18vw, 180px)",
          height: "clamp(100px, 18vw, 180px)",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle at 32% 32%, rgba(255,252,255,0.98) 0%, rgba(250,246,255,0.92) 25%, rgba(238,232,252,0.8) 55%, rgba(220,212,248,0.5) 100%)",
          boxShadow: [
            "0 0 50px 20px rgba(220,210,255,0.4)",
            "0 0 100px 40px rgba(180,160,255,0.25)",
            "0 0 150px 50px rgba(140,120,240,0.15)",
            "inset 0 0 40px rgba(255,255,255,0.2)",
          ].join(", "),
        }}
      />

      {/* 6. Vignette — dark mode finish */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 88% 82% at 50% 50%, transparent 45%, rgba(3,5,14,0.5) 100%)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
