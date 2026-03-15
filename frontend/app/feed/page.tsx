"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FeedContainer from "@/components/FeedContainer";
import InterestProfilePanel from "@/components/InterestProfilePanel";
import CosmicFeedBackground from "@/components/CosmicFeedBackground";

export default function FeedPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = localStorage.getItem("scrollsmart_user_id");
    if (!id) {
      router.replace("/onboarding");
    } else {
      setUserId(id);
    }
  }, [router]);

  useEffect(() => {
    if (!showProfile) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowProfile(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showProfile]);

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
      <CosmicFeedBackground />

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
          <span
            className="text-white/95 font-bold text-sm tracking-tight"
            style={{ textShadow: "0 0 20px rgba(108,99,255,0.2)" }}
          >
            ScrollSmart
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pointer-events-auto"
        >
          <button
            type="button"
            onClick={() => setShowProfile((prev) => !prev)}
            aria-pressed={showProfile}
            className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-all ${
              showProfile
                ? "border-[#6c63ff]/70 bg-[rgba(108,99,255,0.22)] text-white shadow-[0_0_26px_rgba(108,99,255,0.32)]"
                : "border-white/15 bg-[rgba(255,255,255,0.06)] text-white/80 hover:bg-[rgba(255,255,255,0.12)]"
            }`}
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: showProfile
                ? "0 0 28px rgba(108,99,255,0.28), inset 0 1px 0 rgba(255,255,255,0.08)"
                : "0 0 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.8" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">{showProfile ? "Hide Profile" : "Show Profile"}</span>
          </button>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-20 z-50 hidden px-6 xl:block">
        <AnimatePresence>
          {showProfile && userId && (
            <div className="pointer-events-auto">
              <InterestProfilePanel userId={userId} variant="split" />
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute right-4 top-20 z-50 xl:hidden md:right-5">
        <AnimatePresence>
          {showProfile && userId && (
            <div className="pointer-events-auto">
              <InterestProfilePanel userId={userId} />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 pointer-events-none"
      >
        <span className="text-white/30 text-xs font-medium tracking-widest uppercase">
          Scroll - travel deeper
        </span>
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
