"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import KnowledgeCard, { CardData } from "./KnowledgeCard";
import { api } from "@/lib/api";

interface FeedContainerProps {
  userId: string;
}

const MAX_CARDS = 30;

export default function FeedContainer({ userId }: FeedContainerProps) {
  const router = useRouter();

  // The card currently on screen
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  // The next card — pre-fetched silently while user reads current
  const [nextCard, setNextCard] = useState<CardData | null>(null);
  // History of cards the user has seen (for engagement tracking)
  const [cardIndex, setCardIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);

  const isFetchingRef = useRef(false);
  const totalFetchedRef = useRef(0);
  const transitioningRef = useRef(false); // sync ref to avoid stale closure
  const engagementRef = useRef({
    liked: false,
    disliked: false,
    went_deeper: false,
    message_count: 0,
    start_time: Date.now(),
  });

  const fetchCard = useCallback(async (): Promise<CardData | null> => {
    if (isFetchingRef.current) return null;
    if (totalFetchedRef.current >= MAX_CARDS) return null;

    isFetchingRef.current = true;
    try {
      const card = await api.getNextCard(userId);
      totalFetchedRef.current += 1;
      return card;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("404") || msg.includes("not found")) {
        localStorage.clear();
        router.replace("/onboarding");
      }
      return null;
    } finally {
      isFetchingRef.current = false;
    }
  }, [userId, router]);

  // Pre-fetch next card silently in background
  const prefetchNext = useCallback(async () => {
    if (nextCard) return; // already have one ready
    setNextLoading(true);
    const card = await fetchCard();
    if (card) setNextCard(card);
    setNextLoading(false);
  }, [nextCard, fetchCard]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const first = await fetchCard();
      if (first) {
        setCurrentCard(first);
        engagementRef.current.start_time = Date.now();
      }
      setLoading(false);
      // Immediately start pre-fetching next card in background
      const second = await fetchCard();
      if (second) setNextCard(second);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Advance to next card (called only by user interaction)
  const goNext = useCallback(async () => {
    if (transitioningRef.current) return;
    if (!nextCard && !nextLoading) return; // nothing ready yet
    if (!nextCard) return; // still loading, wait

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

    // Swap cards
    setCurrentCard(nextCard);
    setNextCard(null);
    setCardIndex((i) => i + 1);

    // Reset engagement tracking
    engagementRef.current = {
      liked: false,
      disliked: false,
      went_deeper: false,
      message_count: 0,
      start_time: Date.now(),
    };

    setTimeout(() => {
      transitioningRef.current = false;
      setTransitioning(false);
    }, 450);

    // Pre-fetch next card for after this one
    setTimeout(() => prefetchNext(), 500);
  }, [nextCard, nextLoading, currentCard, userId, prefetchNext]);

  // Listen for: mouse wheel, keyboard arrows/space, touch swipe
  useEffect(() => {
    let touchStartY = 0;
    let wheelCooldown = false;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 30 && !wheelCooldown) {
        wheelCooldown = true;
        goNext();
        setTimeout(() => { wheelCooldown = false; }, 800);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "Space", " ", "PageDown"].includes(e.key)) {
        e.preventDefault();
        goNext();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (delta > 50) goNext(); // swipe up
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
  }, [goNext]);

  if (loading || !currentCard) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 relative z-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-10 h-10 rounded-full border-2 border-[#6c63ff] border-t-transparent"
          style={{ boxShadow: "0 0 24px rgba(108,99,255,0.25)" }}
        />
        <p className="text-white/50 text-sm">Discovering your first knowledge planet...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden relative z-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.card_id}
          initial={{ y: "100%", scale: 0.92, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: "-80%", scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <KnowledgeCard
            card={currentCard}
            userId={userId}
            isActive={!transitioning}
            onEngage={() => {}} // engagement sent in goNext()
            onLikeChange={(v) => { engagementRef.current.liked = v; }}
            onDislikeChange={(v) => { engagementRef.current.disliked = v; }}
            onGoDeeperChange={(v) => { engagementRef.current.went_deeper = v; }}
            onMessageSent={() => { engagementRef.current.message_count += 1; }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Bottom HUD — loading next planet or scroll cue */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 pointer-events-none">
        {nextLoading ? (
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(108,99,255,0.2)",
              boxShadow: "0 0 20px rgba(108,99,255,0.1)",
            }}
          >
            <div className="w-3 h-3 border border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
            <span className="text-white/50 text-xs">Next planet...</span>
          </div>
        ) : nextCard ? (
          <motion.div
            animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="text-white/25"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
