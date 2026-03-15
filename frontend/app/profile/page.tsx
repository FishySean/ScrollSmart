"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import InterestProfilePanel from "@/components/InterestProfilePanel";

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("scrollsmart_user_id");
    if (!id) {
      router.replace("/onboarding");
      return;
    }
    setUserId(id);
  }, [router]);

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/10 bg-[rgba(8,10,24,0.22)] backdrop-blur-xl">
        <Link
          href="/feed"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Back to Feed
        </Link>
        <div className="flex items-center gap-2">
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
          <span className="text-white font-bold text-sm tracking-tight">ScrollSmart</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto w-full max-w-[460px]"
        >
          {userId ? (
            <InterestProfilePanel userId={userId} />
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
