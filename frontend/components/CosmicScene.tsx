"use client";

/**
 * 图三风格纯宇宙画面：深空 + 亮白球体 + 蓝紫粉星云漩涡，无文字
 */
export default function CosmicScene({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[5] cursor-pointer"
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      role="button"
      tabIndex={0}
      aria-label="Continue"
    >
      {/* 深色星空底 */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 120% 100% at 50% 50%, #0d0d2b 0%, #08081a 40%, #030308 100%)",
        }}
      />
      {/* 小星星点 */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 120 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-star-twinkle"
            style={{
              width: 1 + (i % 3) * 0.5,
              height: 1 + (i % 3) * 0.5,
              left: `${(i * 17 + 31) % 100}%`,
              top: `${(i * 13 + 7) % 100}%`,
              opacity: 0.4 + (i % 5) * 0.12,
              animationDelay: `${i * 0.08}s`,
              animationDuration: "3s",
              boxShadow: "0 0 4px rgba(255,255,255,0.8)",
            }}
          />
        ))}
      </div>
      {/* 中央亮白球体 + 光晕 */}
      <div
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "clamp(140px, 22vw, 200px)",
          height: "clamp(140px, 22vw, 200px)",
          background: "radial-gradient(circle at 35% 35%, #ffffff 0%, #f0f0ff 25%, #e8e8ff 50%, rgba(220,220,255,0.6) 75%, transparent 100%)",
          boxShadow: "0 0 80px rgba(255,255,255,0.5), 0 0 160px rgba(200,210,255,0.35), inset 0 0 40px rgba(255,255,255,0.4)",
        }}
      />
      {/* 星云漩涡层 — 蓝紫粉 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ filter: "blur(60px)", opacity: 0.85 }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: "70%",
            height: "70%",
            left: "10%",
            top: "5%",
            background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(100,80,180,0.5) 0%, rgba(80,60,140,0.3) 40%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "65%",
            height: "65%",
            right: "5%",
            top: "25%",
            background: "radial-gradient(ellipse 70% 80% at 40% 50%, rgba(140,100,200,0.45) 0%, rgba(100,70,160,0.25) 50%, transparent 75%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "60%",
            height: "55%",
            left: "20%",
            bottom: "10%",
            background: "radial-gradient(ellipse 60% 70% at 60% 40%, rgba(255,180,200,0.4) 0%, rgba(220,150,180,0.25) 45%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "55%",
            height: "50%",
            right: "15%",
            bottom: "20%",
            background: "radial-gradient(ellipse 65% 55% at 35% 60%, rgba(180,140,220,0.35) 0%, rgba(140,100,200,0.2) 50%, transparent 72%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "50%",
            height: "45%",
            left: "35%",
            top: "30%",
            background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,200,220,0.3) 0%, rgba(240,170,200,0.15) 55%, transparent 75%)",
          }}
        />
      </div>
      {/* 更柔和的顶层星云 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ filter: "blur(90px)", opacity: 0.5 }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: "80%",
            height: "80%",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(120,100,200,0.2) 0%, rgba(80,60,150,0.08) 60%, transparent 80%)",
          }}
        />
      </div>
    </div>
  );
}
