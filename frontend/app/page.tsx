"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Always go to onboarding on fresh load — clears any stale sessions
    localStorage.removeItem("scrollsmart_user_id");
    router.replace("/onboarding");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#0a0a1a]">
      <div className="w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
