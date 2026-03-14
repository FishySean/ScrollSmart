"use client";

import { useState, useEffect, useRef } from "react";
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

export interface CardData {
  card_id: string;
  topic: string;
  hook_message: string;
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

const TYPEWRITER_SPEED_MS = 28;
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

  const typewriterRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accentColor = TOPIC_COLORS[card.topic] || "#6c63ff";

  // Typewriter effect — runs when card becomes active
  useEffect(() => {
    if (!isActive) return;

    setDisplayedHook("");
    setHookDone(false);
    let idx = 0;

    const type = () => {
      if (idx < card.hook_message.length) {
        setDisplayedHook(card.hook_message.slice(0, idx + 1));
        idx++;
        typewriterRef.current = setTimeout(type, TYPEWRITER_SPEED_MS);
      } else {
        setHookDone(true);
      }
    };

    typewriterRef.current = setTimeout(type, 300);
    return () => {
      if (typewriterRef.current) clearTimeout(typewriterRef.current);
    };
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
      <div
        className="w-full max-w-lg h-full max-h-[calc(100vh-2rem)] flex flex-col rounded-3xl overflow-hidden card-glow"
        style={{
          background: `linear-gradient(160deg, #12122a 0%, #0e0e22 100%)`,
          border: `1px solid ${accentColor}30`,
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
            />
            <span className="text-white/50 text-xs font-medium uppercase tracking-widest">
              Knowledge
            </span>
          </div>
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: `${accentColor}18`,
              border: `1px solid ${accentColor}50`,
              color: accentColor,
              boxShadow: `0 0 8px ${accentColor}25`,
            }}
          >
            {card.topic}
          </div>
        </div>

        {/* Hook message */}
        <div className="flex-shrink-0 px-5 pb-4">
          <div
            className="rounded-2xl rounded-tl-sm px-4 py-3.5 text-sm leading-relaxed text-[#e8e8f5]"
            style={{
              background: `linear-gradient(135deg, ${accentColor}18, ${accentColor}08)`,
              border: `1px solid ${accentColor}20`,
            }}
          >
            {displayedHook}
            {!hookDone && <span className="typewriter-cursor" />}
          </div>
        </div>

        {/* Divider */}
        <div
          className="flex-shrink-0 mx-5 mb-3 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}30, transparent)` }}
        />

        {/* Chat */}
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

        {/* Action buttons */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-white/5">
          <ActionButtons
            onLike={handleLike}
            onDislike={handleDislike}
            onGoDeeper={handleGoDeeper}
            liked={liked}
            disliked={disliked}
          />
        </div>
      </div>
    </div>
  );
}
