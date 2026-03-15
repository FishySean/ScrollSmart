"use client";

/**
 * 第一个页面（注册/登录）专用背景：中央粒子球 + 弯月 + 星座 + 星空
 * 与后续页的星轨湖面树影区分开
 */
import SkyAndLakeLayer from "@/components/SkyAndLakeLayer";
import Constellations from "@/components/Constellations";

export default function RegisterBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      {/* 1. 深蓝紫星空底 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0d0e28 0%, #12153a 25%, #0e1035 50%, #0a0c2a 75%, #060820 100%)",
        }}
      />

      {/* 2. 中央粒子球/星云 — particle-planet iframe */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      >
        <iframe
          src="/particle-planet.html?overlay=1"
          title="Nebula"
          className="w-full h-full border-none bg-transparent"
          style={{ display: "block", background: "transparent", pointerEvents: "none" }}
        />
      </div>

      {/* 3. 弯月 + 星星 + 云层 */}
      <SkyAndLakeLayer />

      {/* 4. 星座连线 */}
      <Constellations />
    </div>
  );
}
