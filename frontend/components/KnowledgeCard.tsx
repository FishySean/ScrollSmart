"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ActionButtons from "./ActionButtons";
import ChatInterface from "./ChatInterface";

const TOPIC_COLORS: Record<string, string> = {
  "Fitness": "#ff6b6b",
  "Psychology": "#a855f7",
  "Quantum Physics": "#06b6d4",
  "Personal Finance": "#22c55e",
  "History": "#f59e0b",
  "Philosophy": "#8b5cf6",
  "Programming": "#3b82f6",
  "Nutrition": "#84cc16",
  "Astronomy": "#6366f1",
  "Linguistics": "#ec4899",
  "Evolutionary Biology": "#10b981",
  "Neuroscience": "#f97316",
  "Climate Science": "#14b8a6",
  "Geopolitics": "#ef4444",
  "Stoicism": "#a78bfa",
  "Mathematics": "#60a5fa",
  "Architecture": "#fbbf24",
  "Behavioral Economics": "#34d399",
  "Music Theory": "#f472b6",
  "Cryptography": "#818cf8",
  "Ancient Civilizations": "#fb923c",
  "Robotics": "#38bdf8",
  "Ethics": "#c084fc",
  "Cognitive Science": "#4ade80",
  "Astrophysics": "#7dd3fc",
};

const TOPICS_WITH_RING = new Set([
  "Astronomy",
  "Astrophysics",
  "Philosophy",
  "Mathematics",
  "Cryptography",
]);

export interface CardData {
  card_id: string;
  topic: string;
  hook_message: string;
  pregenerated_elaboration?: string;
}

interface KnowledgeCardProps {
  card: CardData;
  userId: string;
  isActive: boolean;
  onEngage: () => void;
  onLikeChange: (v: boolean) => void;
  onDislikeChange: (v: boolean) => void;
  onGoDeeperChange: (v: boolean) => void;
  onMessageSent: () => void;
}

const GO_DEEPER_PROMPT =
  "Please introduce me to a more advanced and deeper topic in this field";

export default function KnowledgeCard({
  card,
  userId,
  isActive,
  onLikeChange,
  onDislikeChange,
  onGoDeeperChange,
  onMessageSent,
}: KnowledgeCardProps) {
  const [displayedHook, setDisplayedHook] = useState("");
  const [hookDone, setHookDone] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [goDeeperTrigger, setGoDeeperTrigger] = useState<string | null>(null);

  const accentColor = TOPIC_COLORS[card.topic] || "#6c63ff";
  const showRing = TOPICS_WITH_RING.has(card.topic);

  useEffect(() => {
    if (!isActive) return;

    setDisplayedHook(card.hook_message);
    setHookDone(true);
  }, [isActive, card.hook_message]);

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    setDisliked(false);
    onLikeChange(next);
    onDislikeChange(false);
  };

  const handleDislike = () => {
    const next = !disliked;
    setDisliked(next);
    setLiked(false);
    onDislikeChange(next);
    onLikeChange(false);
  };

  const handleGoDeeper = () => {
    onGoDeeperChange(true);
    setGoDeeperTrigger(GO_DEEPER_PROMPT);
    setTimeout(() => setGoDeeperTrigger(null), 100);
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <motion.div
        className="relative w-full max-w-xl h-full max-h-[calc(100vh-2rem)] flex flex-col rounded-[2rem] overflow-hidden"
        initial={false}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          background: `radial-gradient(ellipse 120% 100% at 50% 0%, rgba(28,26,52,0.95) 0%, rgba(14,12,32,0.98) 50%, rgba(8,6,22,0.99) 100%)`,
          boxShadow: `
            0 0 80px ${accentColor}25,
            0 0 120px ${accentColor}12,
            0 0 0 1px ${accentColor}40,
            inset 0 1px 0 rgba(255,255,255,0.06),
            inset -20px -20px 40px rgba(0,0,0,0.2)
          `,
          border: `1px solid ${accentColor}35`,
        }}
      >
        {showRing && (
          <div
            className="absolute pointer-events-none z-0"
            style={{
              left: "50%",
              top: "42%",
              width: "96%",
              height: "32%",
              transform: "translate(-50%, -50%) rotate(-18deg)",
              borderRadius: "50%",
              background: `radial-gradient(ellipse 70% 80% at 50% 50%, transparent 32%, ${accentColor}50 38%, ${accentColor}70 42%, ${accentColor}55 48%, ${accentColor}40 52%, transparent 58%)`,
              boxShadow: `0 0 24px ${accentColor}50, 0 0 48px ${accentColor}25, inset 0 0 20px ${accentColor}20`,
              opacity: 0.95,
            }}
          />
        )}

        <div
          className="absolute inset-0 rounded-[2rem] pointer-events-none -z-10"
          style={{
            filter: "blur(20px)",
            opacity: 0.5,
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accentColor}30 0%, transparent 60%)`,
          }}
        />

        <div className="flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 12px ${accentColor}, 0 0 24px ${accentColor}60`,
              }}
            />
            <span className="text-white/50 text-xs font-medium uppercase tracking-widest">
              Knowledge
            </span>
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: `${accentColor}20`,
              border: `1px solid ${accentColor}50`,
              color: accentColor,
              boxShadow: `0 0 16px ${accentColor}30, inset 0 1px 0 rgba(255,255,255,0.1)`,
            }}
          >
            {card.topic}
          </div>
        </div>

        <div className="flex-shrink-0 px-5 pb-4">
          <div
            className="rounded-2xl rounded-tl-sm px-4 py-3.5 text-sm leading-relaxed text-[#e8e8f5]"
            style={{
              background: `linear-gradient(135deg, ${accentColor}12, ${accentColor}05)`,
              border: `1px solid ${accentColor}18`,
              boxShadow: "0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {displayedHook}
            {!hookDone && <span className="typewriter-cursor" />}
          </div>
        </div>

        <div
          className="flex-shrink-0 mx-5 mb-3 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}25, transparent)` }}
        />

        <div className="flex-1 flex flex-col px-5 min-h-0 overflow-hidden">
          <ChatInterface
            userId={userId}
            cardId={card.card_id}
            topic={card.topic}
            hookMessage={card.hook_message}
            pregeneratedElaboration={card.pregenerated_elaboration}
            onMessageSent={onMessageSent}
            goDeeperTrigger={goDeeperTrigger}
          />
        </div>

        <div
          className="flex-shrink-0 px-5 py-4"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
            background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.2) 100%)",
          }}
        >
          <ActionButtons
            onLike={handleLike}
            onDislike={handleDislike}
            onGoDeeper={handleGoDeeper}
            liked={liked}
            disliked={disliked}
          />
        </div>
      </motion.div>
    </div>
  );
}
