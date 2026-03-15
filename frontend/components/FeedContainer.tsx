"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, PanInfo } from "framer-motion";
import KnowledgeCard from "./KnowledgeCard";
import { api } from "@/lib/api";
import { useFeed } from "@/hooks/useFeed";

interface FeedContainerProps {
  userId: string;
}

export default function FeedContainer({ userId }: FeedContainerProps) {
  const { currentCard, cardBuffer, currentIndex, loadingInitial, nextCardReady, goNext, goPrev } = useFeed(userId);

  const [transitioning, setTransitioning] = useState(false);
  const transitioningRef = useRef(false);
  
  // Track which indices we have already emitted engagement for so we don't spam the DB if they scroll back up
  const reportedIndicesRef = useRef<Set<number>>(new Set());
  
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

  const reportEngagement = useCallback(async (indexToReport: number, card: any) => {
    if (!card) return;
    if (reportedIndicesRef.current.has(indexToReport)) return; // Already reported
    
    reportedIndicesRef.current.add(indexToReport);
    
    const elapsed = Math.floor((Date.now() - engagementRef.current.start_time) / 1000);
    try {
      await api.engage({
        user_id: userId,
        card_id: card.card_id,
        topic: card.topic,
        liked: engagementRef.current.liked,
        disliked: engagementRef.current.disliked,
        went_deeper: engagementRef.current.went_deeper,
        conversation_depth: engagementRef.current.message_count,
        time_on_card: elapsed,
      });
    } catch { /* non-critical */ }
  }, [userId]);

  const handleNext = useCallback(async () => {
    if (transitioningRef.current) return;
    if (!nextCardReady) return;

    transitioningRef.current = true;
    setTransitioning(true);

    // Report engagement for the card we are leaving
    reportEngagement(currentIndex, cardBuffer[currentIndex]);

    goNext();

    setTimeout(() => {
      transitioningRef.current = false;
      setTransitioning(false);
    }, 450);
  }, [nextCardReady, currentIndex, cardBuffer, goNext, reportEngagement]);

  const handlePrev = useCallback(async () => {
    if (transitioningRef.current) return;
    if (currentIndex === 0) return; // Can't go higher than the first card

    transitioningRef.current = true;
    setTransitioning(true);

    // Report engagement for the card we are leaving
    reportEngagement(currentIndex, cardBuffer[currentIndex]);

    goPrev();

    setTimeout(() => {
      transitioningRef.current = false;
      setTransitioning(false);
    }, 450);
  }, [currentIndex, cardBuffer, goPrev, reportEngagement]);

  // Framer Motion drag end handler
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50; // pixels
    if (info.offset.y < -threshold) {
      // Swiped UP -> Go NEXT
      handleNext();
    } else if (info.offset.y > threshold) {
      // Swiped DOWN -> Go PREV
      handlePrev();
    }
  };

  // Listen for: mouse wheel, keyboard arrows
  useEffect(() => {
    let wheelCooldown = false;

    const onWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest(".chat-scroll")) return;

      if (e.deltaY > 30 && !wheelCooldown) {
        wheelCooldown = true;
        handleNext();
        setTimeout(() => { wheelCooldown = false; }, 800);
      } else if (e.deltaY < -30 && !wheelCooldown) {
        wheelCooldown = true;
        handlePrev();
        setTimeout(() => { wheelCooldown = false; }, 800);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      
      if (["ArrowDown", "PageDown"].includes(e.key)) {
        e.preventDefault();
        handleNext();
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [handleNext, handlePrev]);

  if (loadingInitial || !currentCard) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a1a] gap-4">
        <div className="w-10 h-10 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#9999bb] text-sm">Generating your first card...</p>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-[#0a0a1a] relative">
      <motion.div
        className="flex flex-col h-full w-full"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }} // Elastic resistance outside constraints
        dragElastic={0.2} // How far they can pull past constraints
        onDragEnd={handleDragEnd}
        animate={{ y: `-${currentIndex * 100}dvh` }}
        transition={{ 
          type: "spring", 
          stiffness: 250, 
          damping: 30, 
          mass: 0.8 
        }}
      >
        {cardBuffer.map((card, idx) => (
          <div key={card.card_id} className="h-[100dvh] w-full flex-shrink-0 flex items-center justify-center">
            {/* If we are rendering a card that hasn't fully received Agent 1 payload yet (skeleton defensive code) */}
            {!card.hook_message ? (
              <div className="w-[80vw] max-w-lg h-[60vh] rounded-3xl border border-white/10 flex items-center justify-center animate-pulse bg-white/5">
                <span className="text-white/40">Generating AI Insights...</span>
              </div>
            ) : (
              <KnowledgeCard
                card={card}
                userId={userId}
                isActive={currentIndex === idx && !transitioning}
                onEngage={() => {}} // engagement sent in transition logic
                onLikeChange={(v) => { if (currentIndex === idx) engagementRef.current.liked = v; }}
                onDislikeChange={(v) => { if (currentIndex === idx) engagementRef.current.disliked = v; }}
                onGoDeeperChange={(v) => { if (currentIndex === idx) engagementRef.current.went_deeper = v; }}
                onMessageSent={() => { if (currentIndex === idx) engagementRef.current.message_count += 1; }}
              />
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
