"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import KnowledgeCard from "./KnowledgeCard";
import { api } from "@/lib/api";
import { useFeed } from "@/hooks/useFeed";

interface FeedContainerProps {
  userId: string;
}

export default function FeedContainer({ userId }: FeedContainerProps) {
  const { currentCard, currentIndex, loadingInitial, nextCardReady, goNext } = useFeed(userId);

  const [transitioning, setTransitioning] = useState(false);
  const transitioningRef = useRef(false); // sync ref to avoid stale closure
  
  const engagementRef = useRef({
    liked: false,
    disliked: false,
    went_deeper: false,
    message_count: 0,
    start_time: Date.now(),
  });

  // Track start time whenever the active card index changes
  useEffect(() => {
    engagementRef.current = {
      liked: false,
      disliked: false,
      went_deeper: false,
      message_count: 0,
      start_time: Date.now(),
    };
  }, [currentIndex]);

  const handleNext = useCallback(async () => {
    if (transitioningRef.current) return;
    if (!nextCardReady) return; // Wait for the buffer

    transitioningRef.current = true;
    setTransitioning(true);

    // Send engagement data for the card we're leaving
    if (currentCard) {
      const elapsed = Math.floor((Date.now() - engagementRef.current.start_time) / 1000);
      try {
        await api.engage({
          user_id: userId,
          card_id: currentCard.card_id,
          topic: currentCard.topic,
          liked: engagementRef.current.liked,
          disliked: engagementRef.current.disliked,
          went_deeper: engagementRef.current.went_deeper,
          conversation_depth: engagementRef.current.message_count,
          time_on_card: elapsed,
        });
      } catch { /* non-critical */ }
    }

    goNext();

    setTimeout(() => {
      transitioningRef.current = false;
      setTransitioning(false);
    }, 450);
  }, [nextCardReady, currentCard, userId, goNext]);

  // Listen for: mouse wheel, keyboard arrows/space, touch swipe
  useEffect(() => {
    let touchStartY = 0;
    let wheelCooldown = false;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 30 && !wheelCooldown) {
        wheelCooldown = true;
        handleNext();
        setTimeout(() => { wheelCooldown = false; }, 800);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "Space", " ", "PageDown"].includes(e.key)) {
        e.preventDefault();
        handleNext();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (delta > 50) handleNext(); // swipe up
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleNext]);

  if (loadingInitial || !currentCard) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a1a] gap-4">
        <div className="w-10 h-10 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#9999bb] text-sm">Generating your first card...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[#0a0a1a] relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.card_id}
          initial={{ y: "100%", scale: 0.95, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: "-100%", scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <KnowledgeCard
            card={currentCard}
            userId={userId}
            isActive={!transitioning}
            onEngage={() => {}} // engagement sent in handleNext()
            onLikeChange={(v) => { engagementRef.current.liked = v; }}
            onDislikeChange={(v) => { engagementRef.current.disliked = v; }}
            onGoDeeperChange={(v) => { engagementRef.current.went_deeper = v; }}
            onMessageSent={() => { engagementRef.current.message_count += 1; }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Scroll hint at bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 pointer-events-none">
        {!nextCardReady ? (
          <div className="flex items-center gap-2 bg-black/30 rounded-full px-3 py-1.5">
            <div className="w-3 h-3 border border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#9999bb] text-xs">Loading next...</span>
          </div>
        ) : (
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-white/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
        )}
      </div>
    </div>
  );
}
