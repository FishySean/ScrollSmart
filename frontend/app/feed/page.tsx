"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import FeedContainer from "@/components/FeedContainer";
import CosmicFeedBackground from "@/components/CosmicFeedBackground";

export default function FeedPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = localStorage.getItem("scrollsmart_user_id");
    if (!id) {
      router.replace("/onboarding");
    } else {
      setUserId(id);
    }
  }, [router]);

  if (!mounted || !userId) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0b1a]">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-10 h-10 rounded-full border-2 border-[#6c63ff] border-t-transparent"
          style={{ boxShadow: "0 0 24px rgba(108,99,255,0.3)" }}
        />
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Layered cosmic environment — parallax, planets, nebula, particles */}
      <CosmicFeedBackground />

      {/* Minimal HUD — logo + profile */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-5 pt-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 pointer-events-auto"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
            style={{
              background: "linear-gradient(135deg, rgba(108,99,255,0.4), rgba(168,85,247,0.3))",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 0 20px rgba(108,99,255,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            ✦
          </div>
          <span className="text-white/95 font-bold text-sm tracking-tight" style={{ textShadow: "0 0 20px rgba(108,99,255,0.2)" }}>
            ScrollSmart
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pointer-events-auto"
        >
          <Link
            href="/profile"
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 0 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white/80">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Scroll hint — "travel deeper" */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 pointer-events-none"
      >
        <span className="text-white/30 text-xs font-medium tracking-widest uppercase">Scroll — travel deeper</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/25">
            <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>
      </motion.div>

      <FeedContainer userId={userId} />
    </div>
  );
}
