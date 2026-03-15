"use client";

/**
 * 中国水墨画渲染韵味 — 流动彩条在水中洇散
 * 宣纸质感 · 墨渍化开 · 墨分五色 · 空气感与通透 · 气韵 · 纯 CSS + SVG 滤镜
 */
export default function CosmicBackground() {
  return (
    <div
      className="fixed inset-0 z-[4] pointer-events-none overflow-hidden"
      style={{ backgroundAttachment: "fixed" }}
      aria-hidden
    >
      {/* SVG：极细致湍流 + 位移贴图 — 纹理精细约 5 倍，墨渍化开/水汽濡染 */}
      <svg className="absolute w-0 h-0" aria-hidden>
        <defs>
          <filter id="ink-wash-turbulence" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.058 0.068"
              numOctaves="7"
              seed="3"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.058 0.068;0.062 0.072;0.055 0.065;0.058 0.068"
                dur="40s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="32"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* 1. 底层：深邃暗夜蓝（linear-gradient） */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0a0a22 0%, #08082a 30%, #060624 60%, #04041a 100%)",
        }}
      />

      {/* 2. 宣纸质感 — 伪元素极微噪点/纤维（见 .cosmic-xuan-paper::before） */}
      <div className="cosmic-xuan-paper absolute inset-0" />

      {/* 2b. 银河 Milky Way — 独立合成层减少闪烁 */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          pointerEvents: "none",
          transform: "translateZ(0)",
          willChange: "transform",
          backfaceVisibility: "hidden" as const,
          isolation: "isolate",
        }}
      >
        <iframe
          src="/galaxy-milky-way.html?embed=1"
          title="Milky Way Galaxy"
          className="w-full h-full border-none"
          style={{ display: "block", background: "transparent" }}
        />
      </div>

      {/* 3. 水墨彩条 — 如图：珊瑚粉与空灵薰衣草交织缠绕月亮，墨分五色、水汽濡染 */}
      <div
        className="absolute inset-0"
        style={{
          filter: "url(#ink-wash-turbulence)",
          mixBlendMode: "screen",
          opacity: 0.92,
          background: [
            /* 珊瑚粉主条：绕月左上 */
            "radial-gradient(ellipse 55% 45% at 42% 38%, rgba(255,182,193,0.48) 0%, rgba(255,160,178,0.28) 15%, rgba(255,140,165,0.1) 32%, transparent 52%)",
            /* 珊瑚粉辅条：右下延展 */
            "radial-gradient(ellipse 50% 40% at 62% 58%, rgba(255,178,188,0.38) 0%, rgba(255,155,172,0.2) 18%, rgba(255,135,160,0.06) 38%, transparent 58%)",
            /* 珊瑚粉细缕：左侧 */
            "radial-gradient(ellipse 40% 50% at 22% 48%, rgba(255,175,190,0.35) 0%, rgba(255,150,170,0.15) 30%, transparent 55%)",
            /* 空灵薰衣草主条：绕月右侧 */
            "radial-gradient(ellipse 50% 55% at 58% 42%, rgba(228,218,252,0.5) 0%, rgba(212,200,248,0.28) 16%, rgba(198,188,242,0.1) 35%, transparent 55%)",
            /* 薰衣草辅条：左上与背景融 */
            "radial-gradient(ellipse 60% 50% at 32% 32%, rgba(220,212,250,0.42) 0%, rgba(205,195,245,0.22) 22%, rgba(188,180,238,0.06) 45%, transparent 62%)",
            /* 薰衣草细缕：下方 */
            "radial-gradient(ellipse 45% 35% at 52% 68%, rgba(232,224,253,0.36) 0%, rgba(215,206,248,0.16) 28%, transparent 58%)",
            /* 蓝紫过渡：与靛蓝背景交融 */
            "radial-gradient(ellipse 65% 60% at 68% 52%, rgba(190,182,255,0.32) 0%, rgba(168,162,248,0.14) 25%, rgba(148,142,238,0.04) 48%, transparent 65%)",
            "radial-gradient(ellipse 55% 50% at 28% 62%, rgba(178,172,248,0.28) 0%, rgba(158,152,238,0.1) 30%, transparent 58%)",
            /* 环绕月亮的柔光条：中心略浓、边缘化开 */
            "radial-gradient(ellipse 85% 75% at 50% 42%, rgba(255,248,255,0.18) 0%, rgba(242,235,252,0.08) 28%, transparent 52%)",
            /* 圆锥渐变：珊瑚粉与薰衣草大理石式交织 */
            "conic-gradient(from 60deg at 48% 42%, rgba(255,192,210,0.22) 0deg, rgba(232,218,252,0.2) 90deg, rgba(255,178,198,0.18) 180deg, rgba(218,208,250,0.2) 270deg, rgba(255,188,208,0.2) 360deg)",
          ].join(", "),
          backgroundSize: "100% 100%",
        }}
      />

      {/* 3a. 具象彩条 — 一条一条的带状，边缘柔化如河流，同滤镜洇散 */}
      <div
        className="absolute inset-0"
        style={{
          filter: "url(#ink-wash-turbulence)",
          mixBlendMode: "screen",
          opacity: 0.9,
        }}
      >
        {[
          { deg: -22, w: "88%", h: "10%", stops: "rgba(255,178,192,0.3) 0%, rgba(255,178,192,0.18) 22%, rgba(255,178,192,0.05) 38%, transparent 48%" },
          { deg: 18, w: "80%", h: "9%", stops: "rgba(228,216,250,0.34) 0%, rgba(228,216,250,0.2) 24%, rgba(228,216,250,0.04) 40%, transparent 50%" },
          { deg: 52, w: "82%", h: "11%", stops: "rgba(255,182,198,0.26) 0%, rgba(255,182,198,0.12) 28%, transparent 46%" },
          { deg: -38, w: "74%", h: "8%", stops: "rgba(218,208,248,0.28) 0%, rgba(218,208,248,0.1) 30%, transparent 48%" },
          { deg: 68, w: "76%", h: "9%", stops: "rgba(255,188,205,0.24) 0%, rgba(255,188,205,0.08) 32%, transparent 50%" },
          { deg: -8, w: "84%", h: "10%", stops: "rgba(235,224,252,0.28) 0%, rgba(235,224,252,0.12) 26%, transparent 46%" },
          { deg: 35, w: "72%", h: "8%", stops: "rgba(255,172,188,0.22) 0%, rgba(255,172,188,0.06) 34%, transparent 50%" },
        ].map((s, i) => (
          <div
            key={`strip-${i}`}
            className="absolute inset-0"
            style={{
              transform: `rotate(${s.deg}deg)`,
              background: `radial-gradient(ellipse ${s.w} ${s.h} at 50% 50%, ${s.stops})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        ))}
      </div>

      {/* 3b. 水墨银河 — 对角星带，墨分五色、洇散 */}
      <div
        className="absolute inset-0"
        style={{
          filter: "url(#ink-wash-turbulence)",
          mixBlendMode: "screen",
          opacity: 0.82,
          background: [
            /* 银河带：沿对角线分布的柔光，内浓边淡 */
            "radial-gradient(ellipse 25% 12% at 18% 28%, rgba(248,246,255,0.35) 0%, rgba(238,234,252,0.12) 40%, transparent 70%)",
            "radial-gradient(ellipse 28% 14% at 38% 42%, rgba(252,250,255,0.4) 0%, rgba(242,238,255,0.15) 38%, transparent 68%)",
            "radial-gradient(ellipse 22% 10% at 58% 58%, rgba(248,245,255,0.38) 0%, rgba(235,230,252,0.1) 42%, transparent 72%)",
            "radial-gradient(ellipse 26% 11% at 78% 72%, rgba(245,242,255,0.3) 0%, rgba(232,228,250,0.08) 45%, transparent 75%)",
            "radial-gradient(ellipse 30% 15% at 50% 50%, rgba(255,252,255,0.25) 0%, rgba(240,236,252,0.06) 50%, transparent 75%)",
            /* 银河辅带：更淡的一缕 */
            "radial-gradient(ellipse 20% 8% at 28% 38%, rgba(235,232,248,0.2) 0%, transparent 60%)",
            "radial-gradient(ellipse 18% 9% at 68% 62%, rgba(238,235,250,0.18) 0%, transparent 58%)",
          ].join(", "),
          backgroundSize: "100% 100%",
        }}
      />

      {/* 4. 通透水汽层：backdrop-filter 微模糊 + lighten，避免厚重油漆感 */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(1.2px)",
          WebkitBackdropFilter: "blur(1.2px)",
          background: "radial-gradient(ellipse 100% 100% at 50% 48%, transparent 45%, rgba(12,12,32,0.06) 70%, rgba(6,6,24,0.1) 100%)",
          mixBlendMode: "lighten",
          opacity: 0.92,
        }}
      />

      {/* 5. 轻量 screen 提亮：增强空气感 */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          mixBlendMode: "screen",
          background: "radial-gradient(ellipse 85% 75% at 50% 45%, rgba(255,248,255,0.08) 0%, transparent 55%)",
        }}
      />

      {/* 6. 金色微光粉（虹彩高光） */}
      <div className="cosmic-micro-glitter absolute inset-0 overflow-hidden" />

      {/* 7. 满月 — 柔和深远光晕，如朦胧水汽中透出 */}
      <div
        className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "clamp(96px, 15vw, 150px)",
          height: "clamp(96px, 15vw, 150px)",
          background: "radial-gradient(circle at 28% 28%, #fffef8 0%, #fffaf5 15%, #f8f5ff 40%, rgba(248,242,255,0.7) 70%, transparent 100%)",
          boxShadow: [
            "0 0 40px 12px rgba(255,255,255,0.2)",
            "0 0 80px 28px rgba(252,248,255,0.15)",
            "0 0 140px 45px rgba(245,238,255,0.1)",
            "0 0 200px 60px rgba(238,230,252,0.06)",
            "0 0 260px 80px rgba(232,225,248,0.03)",
            "inset -4px -4px 16px rgba(255,255,255,0.08)",
            "inset 2px 2px 10px rgba(255,255,255,0.04)",
          ].join(", "),
        }}
      />

      {/* 8. 星层 — 自然分布 + 四角星 + 星团 */}
      <div className="absolute inset-0">
        {[
          [16, 12], [82, 16], [44, 20], [70, 26], [10, 32], [56, 36], [90, 40], [26, 46],
          [76, 50], [6, 56], [50, 60], [86, 64], [20, 70], [64, 74], [36, 80], [80, 84],
          [48, 10], [14, 24], [72, 30], [30, 42], [60, 54], [24, 66], [54, 76], [94, 46],
          [38, 28], [66, 68], [12, 52], [88, 22],
        ].map(([left, top], i) => (
          <div
            key={`dot-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: 1 + (i % 3) * 0.35,
              height: 1 + (i % 3) * 0.35,
              transform: "translate(-50%, -50%)",
              opacity: 0.45 + (i % 6) * 0.09,
              boxShadow: "0 0 2px rgba(255,255,255,0.65)",
            }}
          />
        ))}
        {[
          { left: "20%", top: "24%" },
          { left: "82%", top: "56%" },
          { left: "52%", top: "14%" },
        ].map((s, i) => (
          <div
            key={`4star-${i}`}
            className="star-four-point absolute"
            style={{
              left: s.left,
              top: s.top,
              filter: "drop-shadow(0 0 3px rgba(255,255,255,0.75))",
            }}
          />
        ))}
        {[
          { left: "30%", top: "16%", n: 4 },
          { left: "66%", top: "30%", n: 5 },
          { left: "16%", top: "60%", n: 3 },
          { left: "76%", top: "70%", n: 4 },
          { left: "46%", top: "80%", n: 3 },
          { left: "88%", top: "18%", n: 3 },
        ].map((c, i) => (
          <div
            key={`cluster-${i}`}
            className="absolute"
            style={{ left: c.left, top: c.top, transform: "translate(-50%, -50%)" }}
          >
            {Array.from({ length: c.n }).map((_, j) => (
              <div
                key={j}
                className="absolute rounded-full bg-white"
                style={{
                  width: 1 + (j % 2) * 0.4,
                  height: 1 + (j % 2) * 0.4,
                  left: (j - c.n / 2) * 4.5 + "px",
                  top: ((j * 2.1) % c.n - c.n / 2) * 3.5 + "px",
                  opacity: 0.5 + (j % 3) * 0.12,
                  boxShadow: "0 0 2px rgba(255,255,255,0.7)",
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* 9. 最顶层：轻微暗角与景深，不破坏通透 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 88% 92% at 50% 46%, transparent 38%, rgba(6,6,20,0.08) 68%, rgba(3,3,14,0.18) 100%)",
          mixBlendMode: "multiply",
          opacity: 0.78,
        }}
      />
    </div>
  );
}
