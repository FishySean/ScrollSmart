"use client";

/**
 * 分散的星座 — SVG 星点 + 连线，与星空风格一致
 * 每个星座：一组坐标 (0–100) + 连线索引
 */
const CONSTELLATIONS: {
  position: { left: string; top: string }; // 星座整体在视口中的位置
  size: number; // 整体缩放 (px)
  stars: [number, number][]; // 星点 [x%, y%] 相对星座框
  links: [number, number][]; // 连线 [星索引, 星索引]
}[] = [
  // 左上 — 简化猎户座
  {
    position: { left: "8%", top: "18%" },
    size: 110,
    stars: [
      [20, 15], [50, 10], [80, 18], [35, 45], [65, 42], [50, 70], [30, 85], [70, 82],
    ],
    links: [[0, 1], [1, 2], [1, 3], [1, 4], [3, 4], [3, 5], [4, 5], [5, 6], [5, 7]],
  },
  // 右上 — 简化北斗
  {
    position: { left: "72%", top: "12%" },
    size: 100,
    stars: [
      [25, 35], [45, 25], [65, 28], [85, 22], [80, 45], [60, 55], [40, 70],
    ],
    links: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 4], [2, 5], [1, 5], [1, 6], [0, 6]],
  },
  // 中右 — 小三角+斜线
  {
    position: { left: "78%", top: "42%" },
    size: 74,
    stars: [
      [30, 20], [70, 25], [50, 75], [85, 50], [15, 60],
    ],
    links: [[0, 1], [1, 2], [2, 0], [1, 3], [2, 4]],
  },
  // 中下偏左 — 简化仙后座 W
  {
    position: { left: "18%", top: "62%" },
    size: 88,
    stars: [
      [20, 50], [45, 25], [70, 50], [45, 75], [90, 45],
    ],
    links: [[0, 1], [1, 2], [2, 3], [3, 0], [2, 4]],
  },
  // 右下 — 小菱形
  {
    position: { left: "68%", top: "72%" },
    size: 64,
    stars: [
      [50, 10], [85, 50], [50, 90], [15, 50],
    ],
    links: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]],
  },
];

function ConstellationSvg({
  stars,
  links,
  size,
  id,
}: {
  stars: [number, number][];
  links: [number, number][];
  size: number;
  id: number;
}) {
  const w = 100;
  const h = 100;
  const linePath = links
    .map(([a, b]) => {
      const [x1, y1] = stars[a];
      const [x2, y2] = stars[b];
      return `M ${(x1 / 100) * w} ${(y1 / 100) * h} L ${(x2 / 100) * w} ${(y2 / 100) * h}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="absolute w-full h-full"
      style={{ filter: "drop-shadow(0 0 2px rgba(180,200,255,0.3))" }}
    >
      <defs>
        <linearGradient id={`constellationLine-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(180,200,255,0.35)" />
          <stop offset="100%" stopColor="rgba(200,220,255,0.25)" />
        </linearGradient>
      </defs>
      {/* 连线 */}
      <path
        d={linePath}
        fill="none"
        stroke={`url(#constellationLine-${id})`}
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      {/* 星点 */}
      {stars.map(([x, y], i) => (
        <circle
          key={i}
          cx={(x / 100) * w}
          cy={(y / 100) * h}
          r={i % 3 === 0 ? 1.8 : 1.2}
          fill="rgba(255,255,255,0.92)"
          className="animate-star-twinkle"
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: "4s",
            filter: "drop-shadow(0 0 3px rgba(200,220,255,0.8))",
          }}
        />
      ))}
    </svg>
  );
}

export default function Constellations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1]" aria-hidden>
      {CONSTELLATIONS.map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: c.position.left,
            top: c.position.top,
            width: c.size,
            height: c.size,
          }}
        >
          <ConstellationSvg
            id={i}
            stars={c.stars}
            links={c.links}
            size={c.size}
          />
        </div>
      ))}
    </div>
  );
}
