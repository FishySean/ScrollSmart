"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FeedContainer from "@/components/FeedContainer";
import InterestProfilePanel from "@/components/InterestProfilePanel";

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
      <div className="h-screen flex items-center justify-center bg-[#0a0a1a]">
        <div className="w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-[#0a0a1a]">
      {/* Nav overlay */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-5 pt-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-1.5 pointer-events-auto"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#6c63ff] to-[#a855f7] flex items-center justify-center text-xs">
            ✦
          </div>
          <span className="text-white font-bold text-sm tracking-tight">ScrollSmart</span>
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
                ? "border-[#6c63ff]/60 bg-[#6c63ff]/20 text-white shadow-[0_0_20px_rgba(108,99,255,0.25)]"
                : "border-white/10 bg-white/8 text-white/80 hover:bg-white/15"
            }`}
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
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: 3, duration: 1.2, ease: "easeInOut" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white/20">
            <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>
      </motion.div>
      <FeedContainer userId={userId} />
    </div>
  );
}
