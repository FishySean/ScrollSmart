"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import FeedContainer from "@/components/FeedContainer";

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
          <Link
            href="/profile"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/8 border border-white/10 hover:bg-white/15 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.8" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </Link>
        </motion.div>
      </div>

      <FeedContainer userId={userId} />
    </div>
  );
}
