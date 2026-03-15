"use client";

import { useEffect, useState } from "react";

/**
 * Layered cosmic environment for feed: deep space, distant planets, nebula, fog, floating particles.
 * Parallax on mouse; hand-painted indie / Depth Borne mood.
 */
export default function CosmicFeedBackground() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const px = (mouse.x - 0.5) * 20;
  const py = (mouse.y - 0.5) * 15;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* 1. Base: deep space / deep ocean gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0a0b1a 0%, #0d0e28 25%, #0a0c24 50%, #070918 75%, #050612 100%)",
        }}
      />

      {/* 2. 飘带银河 — 斜向光带 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${px * 0.3}px, ${py * 0.3}px)`,
          background: `
            linear-gradient(128deg, transparent 0%, transparent 32%, rgba(180,160,255,0.08) 38%, rgba(220,200,255,0.18) 45%, rgba(255,240,255,0.12) 50%, rgba(200,180,255,0.16) 55%, rgba(140,120,220,0.1) 62%, transparent 68%, transparent 100%),
            linear-gradient(128deg, transparent 0%, transparent 28%, rgba(120,100,200,0.06) 34%, rgba(160,140,240,0.12) 42%, rgba(200,180,255,0.1) 48%, rgba(160,130,230,0.08) 54%, transparent 60%, transparent 100%)
          `,
          maskImage: "linear-gradient(128deg, transparent 0%, black 25%, black 75%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(128deg, transparent 0%, black 25%, black 75%, transparent 100%)",
        }}
      />

      {/* 2b. Distant nebula clouds — 更鲜艳 */}
      <div
        className="absolute inset-0 opacity-75"
        style={{
          transform: `translate(${px * 0.5}px, ${py * 0.5}px)`,
          background: `
            radial-gradient(ellipse 80% 50% at 20% 30%, rgba(100,60,180,0.35) 0%, transparent 50%),
            radial-gradient(ellipse 60% 70% at 80% 60%, rgba(60,80,200,0.3) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 50% 80%, rgba(140,80,200,0.25) 0%, transparent 45%)
          `,
        }}
      />

      {/* 3. Distant planets — 颜色更鲜艳、更亮 */}
      <div
        className="absolute inset-0"
        style={{ transform: `translate(${px}px, ${py}px)` }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: "clamp(88px, 16vw, 168px)",
            height: "clamp(88px, 16vw, 168px)",
            left: "8%",
            top: "18%",
            opacity: 0.75,
            background: "radial-gradient(circle at 30% 30%, rgba(220,200,255,0.9), rgba(140,100,220,0.6))",
            boxShadow: "0 0 80px rgba(160,120,255,0.5), 0 0 120px rgba(120,80,220,0.3), inset -10px -10px 30px rgba(0,0,0,0.15)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "clamp(68px, 13vw, 120px)",
            height: "clamp(68px, 13vw, 120px)",
            right: "10%",
            top: "20%",
            opacity: 0.7,
            background: "radial-gradient(circle at 35% 35%, rgba(255,180,240,0.85), rgba(180,80,200,0.55))",
            boxShadow: "0 0 70px rgba(220,140,255,0.45), 0 0 100px rgba(180,80,220,0.25)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "clamp(58px, 11vw, 112px)",
            height: "clamp(58px, 11vw, 112px)",
            right: "18%",
            bottom: "28%",
            opacity: 0.7,
            background: "radial-gradient(circle at 35% 35%, rgba(150,220,255,0.9), rgba(60,160,230,0.5))",
            boxShadow: "0 0 60px rgba(100,200,255,0.5), 0 0 90px rgba(80,180,255,0.3)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "clamp(70px, 13vw, 124px)",
            height: "clamp(70px, 13vw, 124px)",
            left: "12%",
            bottom: "25%",
            opacity: 0.72,
            background: "radial-gradient(circle at 40% 40%, rgba(255,255,180,0.85), rgba(255,220,100,0.5))",
            boxShadow: "0 0 65px rgba(255,235,150,0.5), 0 0 95px rgba(255,210,100,0.28)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "clamp(72px, 14vw, 128px)",
            height: "clamp(72px, 14vw, 128px)",
            left: "22%",
            top: "35%",
            opacity: 0.65,
            background: "radial-gradient(circle at 40% 40%, rgba(255,160,220,0.8), rgba(200,80,160,0.5))",
            boxShadow: "0 0 70px rgba(255,120,200,0.4), 0 0 100px rgba(220,80,180,0.25)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "clamp(60px, 11vw, 110px)",
            height: "clamp(60px, 11vw, 110px)",
            right: "5%",
            top: "55%",
            opacity: 0.6,
            background: "radial-gradient(circle at 35% 35%, rgba(180,255,220,0.75), rgba(80,200,160,0.45))",
            boxShadow: "0 0 55px rgba(120,255,200,0.4)",
          }}
        />
        {/* 地球 — 蓝海 + 云层高光 */}
        <div
          className="absolute rounded-full overflow-hidden"
          style={{
            width: "clamp(78px, 15vw, 150px)",
            height: "clamp(78px, 15vw, 150px)",
            left: "50%",
            top: "12%",
            transform: "translateX(-50%)",
            opacity: 0.85,
            background: `
              radial-gradient(circle at 28% 28%, rgba(255,255,255,0.35) 0%, transparent 22%),
              radial-gradient(circle at 65% 40%, rgba(140,200,220,0.5) 0%, transparent 25%),
              radial-gradient(circle at 75% 65%, rgba(80,160,120,0.4) 0%, transparent 20%),
              radial-gradient(circle at 35% 70%, rgba(100,180,140,0.35) 0%, transparent 18%),
              radial-gradient(ellipse 100% 100% at 50% 50%, rgba(60,140,200,0.9) 0%, rgba(30,90,160,0.85) 45%, rgba(20,70,130,0.9) 100%)`,
            boxShadow: "0 0 70px rgba(80,160,220,0.4), 0 0 110px rgba(50,120,200,0.25), inset -12px -12px 28px rgba(0,0,0,0.2), inset 8px 8px 20px rgba(255,255,255,0.08)",
          }}
        />
      </div>

      {/* 3b. 带坑月球 */}
      <div
        className="absolute rounded-full overflow-visible"
        style={{
          width: "clamp(95px, 18vw, 175px)",
          height: "clamp(95px, 18vw, 175px)",
          right: "6%",
          bottom: "18%",
          transform: `translate(${px * 0.3}px, ${py * 0.3}px)`,
          background: "radial-gradient(circle at 35% 30%, rgba(220,218,210,0.9), rgba(160,158,150,0.7))",
          boxShadow: "0 0 40px rgba(200,198,190,0.25), inset -8px -8px 20px rgba(0,0,0,0.15), inset 4px 4px 12px rgba(255,255,255,0.1)",
        }}
      >
        <div className="absolute rounded-full bg-black/25 w-4 h-4 top-[22%] left-[28%]" />
        <div className="absolute rounded-full bg-black/20 w-3 h-3 top-[45%] left-[15%]" />
        <div className="absolute rounded-full bg-black/22 w-3.5 h-3.5 top-[60%] left-[35%]" />
        <div className="absolute rounded-full bg-black/18 w-2.5 h-2.5 top-[35%] left-[55%]" />
        <div className="absolute rounded-full bg-black/20 w-2 h-2 top-[50%] left-[68%]" />
        <div className="absolute rounded-full bg-black/15 w-2 h-2 top-[25%] left-[72%]" />
      </div>

      {/* 4. Fog / ambient haze */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(15,15,35,0.2) 40%, rgba(10,10,28,0.35) 100%)",
        }}
      />

      {/* 5. Floating particles + 多色闪动星星 — 更亮更鲜艳 */}
      <div className="absolute inset-0">
        {[
          { r: 255, g: 255, b: 255 },
          { r: 220, g: 200, b: 255 },
          { r: 200, g: 180, b: 255 },
          { r: 180, g: 220, b: 255 },
          { r: 255, g: 220, b: 240 },
          { r: 255, g: 240, b: 200 },
          { r: 200, g: 255, b: 220 },
        ].flatMap((c, ci) =>
          Array.from({ length: 8 }).map((_, i) => ({ ...c, i: ci * 8 + i }))
        ).map(({ r, g, b, i }) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-particle"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              left: `${(i * 7 + 10) % 100}%`,
              top: `${(i * 11 + 5) % 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${8 + (i % 5)}s`,
              background: `rgb(${r},${g},${b})`,
              opacity: 0.7,
              boxShadow: `0 0 10px rgba(${r},${g},${b},0.8), 0 0 20px rgba(${r},${g},${b},0.4)`,
            }}
          />
        ))}
        {[
          "255,255,255",
          "240,220,255",
          "220,240,255",
          "255,230,245",
          "255,255,200",
          "200,255,230",
        ].flatMap((rgb, ci) =>
          Array.from({ length: 6 }).map((_, i) => ({ rgb, i: ci * 6 + i }))
        ).map(({ rgb, i }) => (
          <div
            key={`twinkle-${i}`}
            className="absolute rounded-full animate-star-twinkle"
            style={{
              width: 2.5,
              height: 2.5,
              left: `${(i * 11 + 2) % 97}%`,
              top: `${(i * 15 + 6) % 94}%`,
              animationDelay: `${i * 0.2}s`,
              background: `rgb(${rgb})`,
              boxShadow: `0 0 12px rgba(${rgb},0.95), 0 0 24px rgba(${rgb},0.5)`,
            }}
          />
        ))}
      </div>

      {/* 5b. 漂浮陨石 */}
      {[
        { left: "15%", top: "12%", w: 10, h: 8, delay: "0s" },
        { left: "78%", top: "35%", w: 14, h: 10, delay: "2s" },
        { left: "8%", top: "55%", w: 8, h: 6, delay: "1s" },
        { left: "85%", top: "70%", w: 12, h: 9, delay: "3s" },
        { left: "72%", top: "15%", w: 9, h: 7, delay: "1.5s" },
        { left: "25%", top: "78%", w: 11, h: 8, delay: "0.5s" },
      ].map((rock, i) => (
        <div
          key={`rock-${i}`}
          className="absolute animate-float-drift rounded-full opacity-50"
          style={{
            left: rock.left,
            top: rock.top,
            width: rock.w,
            height: rock.h,
            animationDelay: rock.delay,
            background: "radial-gradient(ellipse at 30% 30%, rgba(180,170,160,0.6), rgba(80,70,60,0.5))",
            boxShadow: "inset -1px -1px 2px rgba(0,0,0,0.3), 0 0 8px rgba(120,110,100,0.2)",
          }}
        />
      ))}

      {/* 5c. 漂浮宇宙飞船 */}
      <div
        className="absolute animate-float-drift opacity-70"
        style={{
          left: "12%",
          top: "28%",
          animationDuration: "14s",
          animationDelay: "0s",
        }}
      >
        <svg width="28" height="14" viewBox="0 0 28 14" fill="none" className="drop-shadow-[0_0_6px_rgba(180,200,255,0.5)]">
          <path d="M2 7 L14 2 L26 7 L14 12 Z" fill="rgba(180,200,255,0.85)" stroke="rgba(220,230,255,0.5)" strokeWidth="0.8" />
          <circle cx="14" cy="7" r="2" fill="rgba(220,235,255,0.9)" />
        </svg>
      </div>
      <div
        className="absolute animate-float-drift opacity-50"
        style={{
          right: "18%",
          top: "48%",
          animationDuration: "18s",
          animationDelay: "4s",
        }}
      >
        <svg width="22" height="11" viewBox="0 0 22 11" fill="none" className="drop-shadow-[0_0_4px_rgba(200,180,255,0.4)]">
          <path d="M1 5.5 L11 1 L21 5.5 L11 10 Z" fill="rgba(200,180,255,0.75)" stroke="rgba(230,210,255,0.4)" strokeWidth="0.6" />
          <circle cx="11" cy="5.5" r="1.5" fill="rgba(240,225,255,0.9)" />
        </svg>
      </div>
      <div
        className="absolute animate-float-drift opacity-40"
        style={{
          left: "70%",
          bottom: "25%",
          animationDuration: "16s",
          animationDelay: "6s",
        }}
      >
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none" className="drop-shadow-[0_0_4px_rgba(255,220,180,0.35)]">
          <path d="M0 5 L10 0 L20 5 L10 10 Z" fill="rgba(255,230,200,0.6)" stroke="rgba(255,240,220,0.35)" strokeWidth="0.5" />
          <circle cx="10" cy="5" r="1.2" fill="rgba(255,245,230,0.85)" />
        </svg>
      </div>

      {/* 6. Soft vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 50%, rgba(2,2,12,0.4) 100%)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
