"use client";

import { useEffect, useRef } from "react";

/**
 * 长曝光星轨风格：同心圆星轨绕天极旋转 + 湖面 + 湖心树影 + 远山
 * 天空偏蓝紫，星轨密而平滑，缓慢旋转
 */
export default function StarTrailBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let angle = 0;
    let rafId: number;

    // 天极位置（星轨旋转中心，偏上）
    const poleX = () => w / 2;
    const poleY = () => h * 0.32;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = poleX();
      const cy = poleY();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.translate(-cx, -cy);

      const maxR = Math.max(w, h) * 0.72;

      // 星轨疏一些，顺时针缓慢旋转（正角度为顺时针）
      for (let r = 20; r <= maxR; r += 14) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        const alpha = 0.18 + 0.22 * (1 - r / maxR);
        ctx.strokeStyle = `rgba(230, 238, 255, ${alpha})`;
        ctx.lineWidth = 0.95;
        ctx.shadowColor = "rgba(255, 255, 255, 0.45)";
        ctx.shadowBlur = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      for (let r = 35; r <= maxR; r += 32) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        const alpha = 0.3 + 0.2 * (1 - r / maxR);
        ctx.strokeStyle = `rgba(240, 245, 255, ${alpha})`;
        ctx.lineWidth = 1.4;
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
        ctx.shadowBlur = 4;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
      angle += 0.0014;
      rafId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* 1. 天空：偏蓝紫色，不刻意压得很暗 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1a1a3e 0%, #252550 22%, #1e2048 45%, #16183a 68%, #0f1130 85%, #0a0c28 100%)",
        }}
      />

      {/* 2. 星轨画布：同心圆旋转 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ display: "block" }}
      />

      {/* 3. 远山剪影 */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          bottom: "22%",
          height: "28%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(8,10,28,0.3) 20%, rgba(5,6,18,0.95) 100%)",
          clipPath: "polygon(0% 100%, 2% 75%, 8% 60%, 15% 70%, 22% 55%, 30% 65%, 38% 50%, 48% 58%, 55% 45%, 65% 52%, 78% 48%, 88% 55%, 96% 50%, 100% 60%, 100% 100%)",
        }}
      />

      {/* 4. 湖面：横向一条，在画面中下部 */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: "58%",
          height: "24%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(12,14,35,0.5) 10%, rgba(8,10,30,0.75) 50%, rgba(6,8,25,0.6) 90%, transparent 100%)",
          boxShadow: "0 0 60px rgba(40,50,100,0.15)",
        }}
      />

      {/* 5. 湖心树影：居中裸树剪影 */}
      <svg
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          top: "46%",
          width: "min(20vw, 100px)",
          height: "auto",
          transform: "translate(-50%, 0)",
          filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.6))",
        }}
        viewBox="0 0 50 95"
        fill="none"
      >
        <path
          d="M25 95 L24 58 L26 58 Z"
          fill="#040510"
          stroke="#030408"
          strokeWidth="0.6"
        />
        <path
          d="M25 58 L25 52 L15 32 L25 42 L25 36 L18 18 L25 28 L25 24 L22 8 L25 16 L25 10 L28 2 L25 8 L25 16 L32 8 L25 24 L25 28 L32 18 L25 36 L25 42 L35 32 L25 52 Z"
          fill="#040510"
          stroke="#050610"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}
