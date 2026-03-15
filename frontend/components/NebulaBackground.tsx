"use client";

import { useEffect, useRef, useState } from "react";

export default function NebulaBackground() {
  const [cacheKey] = useState(() => Date.now());
  const galaxyRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const sendScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const progress = window.scrollY / maxScroll;
      galaxyRef.current?.contentWindow?.postMessage({ scroll: progress }, "*");
    };
    window.addEventListener("scroll", sendScroll, { passive: true });
    sendScroll();
    return () => window.removeEventListener("scroll", sendScroll);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
      {/* 底层：银河粒子背景（随页面滚动相机穿行） */}
      <iframe
        ref={galaxyRef}
        src={`/galaxy-scroll.html?t=${cacheKey}`}
        title="Galaxy background"
        className="absolute inset-0 w-full h-full border-none"
        style={{ pointerEvents: "none" }}
      />
      {/* 上层：星球 + 星云（透明背景，不遮挡银河） */}
      <iframe
        src={`/particle-planet.html?overlay=1&t=${cacheKey}`}
        title="Nebula background"
        className="absolute inset-0 w-full h-full border-none"
        style={{ pointerEvents: "none", background: "transparent" }}
      />
    </div>
  );
}
