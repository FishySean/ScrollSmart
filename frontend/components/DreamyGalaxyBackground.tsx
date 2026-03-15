"use client";

/**
 * Dreamy Galaxy Theme — cosmic UI background
 * Deep navy space · swirling nebula · marble fluid · glowing stars · dreamy moon
 * Soft glow, ethereal, smooth blue/purple/pink gradients, modern dark
 */
export default function DreamyGalaxyBackground() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      style={{ backgroundAttachment: "fixed" }}
      aria-hidden
    >
      {/* SVG: swirling nebula displacement */}
      <svg className="absolute w-0 h-0" aria-hidden>
        <defs>
          <filter id="nebula-swirl" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04 0.05"
              numOctaves="5"
              seed="2"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.04 0.05;0.045 0.055;0.038 0.048;0.04 0.05"
                dur="25s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="28"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* 1. Base: deep navy blue space */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, #060818 0%, #0a0c24 25%, #080a20 50%, #050714 75%, #040612 100%)",
        }}
      />

      {/* 2. Nebula clouds — swirling blue, purple, pink (marble-like fluid) */}
      <div
        className="absolute inset-0"
        style={{
          filter: "url(#nebula-swirl)",
          mixBlendMode: "screen",
          opacity: 0.88,
          background: [
            "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(120,100,220,0.35) 0%, rgba(90,70,200,0.15) 35%, transparent 60%)",
            "radial-gradient(ellipse 55% 65% at 35% 55%, rgba(180,130,255,0.28) 0%, rgba(140,100,240,0.1) 40%, transparent 65%)",
            "radial-gradient(ellipse 60% 50% at 65% 35%, rgba(255,180,220,0.25) 0%, rgba(240,150,210,0.08) 38%, transparent 62%)",
            "radial-gradient(ellipse 50% 45% at 25% 35%, rgba(100,120,230,0.22) 0%, transparent 55%)",
            "radial-gradient(ellipse 45% 50% at 72% 62%, rgba(200,160,255,0.2) 0%, transparent 50%)",
            "conic-gradient(from 200deg at 50% 48%, rgba(140,110,255,0.15) 0deg, rgba(255,170,230,0.12) 120deg, rgba(110,130,255,0.14) 240deg, rgba(180,140,255,0.12) 360deg)",
          ].join(", "),
          backgroundSize: "100% 100%",
        }}
      />

      {/* 3. Soft glow overlay — ethereal atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 42%, rgba(160,140,255,0.08) 0%, transparent 55%)",
          mixBlendMode: "screen",
          opacity: 0.95,
        }}
      />

      {/* 4. Glowing stars & particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { left: "12%", top: "18%", size: 1, opacity: 0.9 },
          { left: "88%", top: "22%", size: 1.5, opacity: 0.85 },
          { left: "45%", top: "12%", size: 1, opacity: 0.7 },
          { left: "72%", top: "38%", size: 2, opacity: 0.95 },
          { left: "28%", top: "48%", size: 1, opacity: 0.75 },
          { left: "55%", top: "65%", size: 1.2, opacity: 0.8 },
          { left: "18%", top: "72%", size: 1, opacity: 0.65 },
          { left: "82%", top: "58%", size: 1, opacity: 0.7 },
          { left: "38%", top: "78%", size: 1.5, opacity: 0.85 },
          { left: "62%", top: "85%", size: 1, opacity: 0.6 },
          { left: "5%", top: "45%", size: 1, opacity: 0.5 },
          { left: "95%", top: "75%", size: 1.2, opacity: 0.55 },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              boxShadow: `0 0 ${s.size * 4}px ${s.size * 2}px rgba(255,255,255,0.4), 0 0 ${s.size * 8}px rgba(180,160,255,0.2)`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {/* 5. Dreamy glowing moon — center */}
      <div
        className="absolute left-1/2 top-[42%] rounded-full"
        style={{
          width: "clamp(80px, 14vw, 140px)",
          height: "clamp(80px, 14vw, 140px)",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle at 35% 35%, rgba(255,252,255,0.95) 0%, rgba(248,245,255,0.9) 30%, rgba(235,230,252,0.75) 60%, rgba(220,215,248,0.5) 100%)",
          boxShadow: [
            "0 0 40px 15px rgba(220,210,255,0.35)",
            "0 0 80px 30px rgba(180,160,255,0.2)",
            "0 0 120px 40px rgba(140,120,240,0.12)",
            "inset 0 0 30px rgba(255,255,255,0.15)",
          ].join(", "),
        }}
      />

      {/* 6. Subtle vignette — modern dark finish */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 50%, rgba(4,6,18,0.4) 100%)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
