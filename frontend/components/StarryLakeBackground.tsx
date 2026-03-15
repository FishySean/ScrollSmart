"use client";

/**
 * 深邃星空 + 湖面 + 流星雨绕湖面旋转
 * 无银河层，最初版本风格
 */
export default function StarryLakeBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* 1. 深邃星空底 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #050510 0%, #080818 18%, #0a0a24 40%, #060618 65%, #040612 85%, #03050e 100%)",
        }}
      />

      {/* 2. 星空点缀 */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-star-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: 1.5 + Math.random() * 1.5,
              height: 1.5 + Math.random() * 1.5,
              opacity: 0.5 + Math.random() * 0.5,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2.5}s`,
              boxShadow: "0 0 4px rgba(255,255,255,0.8)",
            }}
          />
        ))}
      </div>

      {/* 3. 湖面 — 横向一条，中下区域 */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: "52%",
          height: "28%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(8,12,28,0.4) 15%, rgba(6,10,24,0.7) 50%, rgba(4,8,18,0.5) 85%, transparent 100%)",
          boxShadow: "0 0 80px rgba(60,80,140,0.08)",
        }}
      />

      {/* 4. 流星雨绕湖面旋转 — 轨道容器旋转，内部多条流星 */}
      <div
        className="absolute left-1/2 top-1/2 pointer-events-none"
        style={{
          width: "180vmax",
          height: "180vmax",
          marginLeft: "-90vmax",
          marginTop: "-90vmax",
          animation: "meteorOrbit 35s linear infinite",
        }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 origin-left"
            style={{
              width: "28vmin",
              height: 2,
              marginTop: -1,
              transform: `rotate(${deg}deg)`,
              background: "linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(200,220,255,0.5) 25%, transparent 100%)",
              boxShadow: "0 0 8px rgba(255,255,255,0.4)",
              animation: "meteorShine 2s ease-in-out infinite",
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
