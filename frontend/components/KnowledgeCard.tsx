"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ActionButtons from "./ActionButtons";
import ChatInterface from "./ChatInterface";

const TOPIC_COLORS: Record<string, string> = {
  "Fitness": "#ff6b6b",
  "Psychology": "#c084fc",
  "Quantum Physics": "#7dd3fc",
  "Personal Finance": "#22c55e",
  "History": "#fde047",
  "Philosophy": "#e879f9",
  "Programming": "#38bdf8",
  "Nutrition": "#84cc16",
  "Astronomy": "#a78bfa",
  "Linguistics": "#f472b6",
  "Evolutionary Biology": "#10b981",
  "Neuroscience": "#f97316",
  "Climate Science": "#14b8a6",
  "Geopolitics": "#ef4444",
  "Stoicism": "#d946ef",
  "Mathematics": "#60a5fa",
  "Architecture": "#fef08a",
  "Behavioral Economics": "#34d399",
  "Music Theory": "#e879f9",
  "Cryptography": "#818cf8",
  "Ancient Civilizations": "#fb923c",
  "Robotics": "#7dd3fc",
  "Ethics": "#c084fc",
  "Cognitive Science": "#4ade80",
  "Astrophysics": "#a5f3fc",
};

/** 部分主题显示土星式环形光环 */
const TOPICS_WITH_RING = new Set(["Astronomy", "Astrophysics", "Philosophy", "Mathematics", "Cryptography"]);

export interface CardData {
  card_id: string;
  topic: string;
  hook_message: string;
  music_name?: string;
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
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [goDeeperTrigger, setGoDeeperTrigger] = useState<string | null>(null);

  const accentColor = TOPIC_COLORS[card.topic] || "#6c63ff";
  const showRing = TOPICS_WITH_RING.has(card.topic);

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
        {/* 土星式环形光环 — 仅部分主题 */}
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

        {/* Orb glow — outer atmosphere */}
        <div
          className="absolute inset-0 rounded-[2rem] pointer-events-none -z-10"
          style={{
            filter: "blur(20px)",
            opacity: 0.5,
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accentColor}30 0%, transparent 60%)`,
          }}
        />

        {/* Header — planet label */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 12px ${accentColor}, 0 0 24px ${accentColor}60`,
              }}
            />
            <span className="text-white/40 text-xs font-medium uppercase tracking-widest">
              Knowledge Planet
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

        {/* Music — minimal HUD bar */}
        <div
          className="flex-shrink-0 mx-5 mb-3 flex items-center gap-2 h-8 rounded-full overflow-hidden"
          style={{
            background: "rgba(0,0,0,0.35)",
            border: `1px solid ${accentColor}15`,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          <span className="flex-shrink-0 pl-3 text-sm opacity-80">🎵</span>
          <div className="music-bar-track flex-1 min-w-0 py-1.5">
            <div className="music-bar-marquee gap-4">
              <span className="text-white/80 text-xs font-medium">{card.music_name ?? "ambient"}</span>
              <span className="text-white/80 text-xs font-medium">{card.music_name ?? "ambient"}</span>
            </div>
          </div>
        </div>

        {/* Hook — discovery message */}
        <div className="flex-shrink min-h-0 px-5 pb-4 flex flex-col">
          <div
            className="rounded-2xl rounded-tl-sm px-4 py-3.5 text-sm leading-relaxed text-[#e4e4f0] overflow-y-auto max-h-[40vh]"
            style={{
              background: `linear-gradient(135deg, ${accentColor}12, ${accentColor}05)`,
              border: `1px solid ${accentColor}18`,
              boxShadow: "0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {card.hook_message}
          </div>
        </div>

        {/* Divider — soft light */}
        <div
          className="flex-shrink-0 mx-5 mb-3 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}25, transparent)` }}
        />

        {/* Chat — explore deeper */}
        <div className="flex-1 flex flex-col px-5 min-h-0 overflow-hidden">
          <ChatInterface
            userId={userId}
            cardId={card.card_id}
            topic={card.topic}
            hookMessage={card.hook_message}
            onMessageSent={onMessageSent}
            goDeeperTrigger={goDeeperTrigger}
          />
        </div>

        {/* Action buttons — HUD style */}
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
