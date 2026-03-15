"use client";

import { useEffect, useRef, useState } from "react";

export default function SkyAndLakeLayer() {
  const [stars, setStars] = useState<{ left: string; top: string; delay: number; duration: number }[]>([]);
  const [smoothMouse, setSmoothMouse] = useState({ x: 0.5, y: 0.5 });
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    setStars(
      Array.from({ length: 80 }, () => ({
        left: Math.random() * 100 + "%",
        top: Math.random() * 75 + "%",
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
      }))
    );
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const m = mouseRef.current;
      setSmoothMouse((prev) => ({
        x: prev.x + (m.x - prev.x) * 0.06,
        y: prev.y + (m.y - prev.y) * 0.06,
      }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      {/* 弯月 — 左上角星空 */}
      <div
        className="absolute left-[10%] top-[12%] w-12 h-12"
        style={{
          filter: "drop-shadow(0 0 12px rgba(255,245,200,0.6)) drop-shadow(0 0 24px rgba(255,235,180,0.3))",
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <radialGradient id="moonGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fff9e6" />
              <stop offset="70%" stopColor="#f5e6b8" />
              <stop offset="100%" stopColor="#e8d9a8" />
            </radialGradient>
            <mask id="crescentMask">
              <circle cx="50" cy="50" r="42" fill="white" />
              <circle cx="68" cy="42" r="38" fill="black" />
            </mask>
          </defs>
          <circle cx="50" cy="50" r="42" fill="url(#moonGrad)" mask="url(#crescentMask)" opacity="0.95" />
        </svg>
      </div>

      {/* 稀疏星星 */}
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 min-w-[2px] min-h-[2px] bg-white rounded-full animate-star-twinkle"
            style={{
              left: s.left,
              top: s.top,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
              boxShadow: "0 0 4px rgba(255,255,255,0.8)",
            }}
          />
        ))}
      </div>

      {/* 厚云层 — 全屏柔和过渡，无硬分界线；鼠标处透明让星云显现 */}
      <div
        className="absolute inset-0 overflow-hidden transition-opacity duration-300"
        style={{
          maskImage: `radial-gradient(circle 50% at ${smoothMouse.x * 100}% ${smoothMouse.y * 100}%, transparent 0%, transparent 50%, white 85%)`,
          WebkitMaskImage: `radial-gradient(circle 50% at ${smoothMouse.x * 100}% ${smoothMouse.y * 100}%, transparent 0%, transparent 50%, white 85%)`,
        }}
      >
        {/* 主云层 — 全屏、低对比、柔和渐变，避免中间分界线 */}
        <div
          className="absolute inset-0 animate-cloud-drift thick-cloud-layer"
          style={{
            background: "radial-gradient(ellipse 120% 80% at 50% 50%, rgba(160,150,255,0.22) 0%, rgba(140,120,255,0.12) 45%, transparent 75%)",
          }}
        />
        <div
          className="absolute inset-0 animate-cloud-drift thick-cloud-layer"
          style={{
            background: "radial-gradient(ellipse 100% 70% at 60% 55%, rgba(200,170,255,0.18) 0%, rgba(150,140,255,0.1) 50%, transparent 80%)",
            animationDelay: "3s",
          }}
        />
        <div
          className="absolute inset-0 animate-cloud-drift thick-cloud-layer"
          style={{
            background: "radial-gradient(ellipse 90% 90% at 40% 50%, rgba(120,150,255,0.16) 0%, rgba(180,160,240,0.1) 55%, transparent 78%)",
            animationDelay: "6s",
          }}
        />
        <div
          className="absolute inset-0 thick-cloud-layer"
          style={{
            background: "radial-gradient(ellipse 110% 60% at 50% 45%, rgba(200,220,255,0.14) 0%, rgba(180,200,255,0.08) 60%, transparent 85%)",
            animation: "cloudDrift 30s ease-in-out infinite",
            animationDelay: "2s",
          }}
        />
      </div>

      {/* 飘动棉花糖云朵（点缀） */}
      <div className="absolute rounded-full blur-[35px] opacity-50 animate-cloud-drift thick-cloud-blob" style={{ left: "10%", top: "55%", width: 200, height: 90, background: "radial-gradient(ellipse, rgba(200,180,255,0.5) 0%, rgba(255,200,230,0.4) 40%, rgba(120,140,255,0.3) 100%)" }} />
      <div className="absolute rounded-full blur-[40px] opacity-45 animate-cloud-drift thick-cloud-blob" style={{ left: "50%", top: "50%", width: 240, height: 110, background: "radial-gradient(ellipse, rgba(180,150,255,0.5) 0%, rgba(255,210,235,0.4) 50%, rgba(100,130,255,0.35) 100%)", animationDelay: "4s" }} />
      <div className="absolute rounded-full blur-[38px] opacity-48 animate-cloud-drift thick-cloud-blob" style={{ left: "75%", top: "58%", width: 180, height: 95, background: "radial-gradient(ellipse, rgba(255,200,230,0.45) 0%, rgba(150,160,255,0.4) 50%, rgba(139,92,246,0.3) 100%)", animationDelay: "7s" }} />
    </div>
  );
}
