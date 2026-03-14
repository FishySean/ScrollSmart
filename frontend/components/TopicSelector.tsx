"use client";

import { motion } from "framer-motion";

const TOPICS = [
  "Fitness", "Psychology", "Quantum Physics", "Personal Finance",
  "History", "Philosophy", "Programming", "Nutrition", "Astronomy",
  "Linguistics", "Evolutionary Biology", "Neuroscience", "Climate Science",
  "Geopolitics", "Stoicism", "Mathematics", "Architecture",
  "Behavioral Economics", "Music Theory", "Cryptography",
  "Ancient Civilizations", "Robotics", "Ethics", "Cognitive Science",
  "Astrophysics",
];

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

interface TopicSelectorProps {
  selected: string[];
  onChange: (topics: string[]) => void;
}

export default function TopicSelector({ selected, onChange }: TopicSelectorProps) {
  const toggle = (topic: string) => {
    if (selected.includes(topic)) {
      onChange(selected.filter((t) => t !== topic));
    } else {
      onChange([...selected, topic]);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
      {TOPICS.map((topic, i) => {
        const isSelected = selected.includes(topic);
        const color = TOPIC_COLORS[topic] || "#6c63ff";

        return (
          <motion.button
            key={topic}
            onClick={() => toggle(topic)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.025, type: "spring", stiffness: 300, damping: 20 }}
            whileTap={{ scale: 0.9 }}
            className="relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 select-none cursor-pointer"
            style={{
              backgroundColor: isSelected ? `${color}25` : "rgba(255,255,255,0.05)",
              border: `1.5px solid ${isSelected ? color : "rgba(255,255,255,0.12)"}`,
              color: isSelected ? color : "rgba(255,255,255,0.7)",
              boxShadow: isSelected ? `0 0 12px ${color}50, 0 0 24px ${color}20` : "none",
            }}
          >
            <motion.span
              className="flex items-center gap-1.5"
            >
              {isSelected && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="text-xs"
                >
                  ✓
                </motion.span>
              )}
              {topic}
            </motion.span>
          </motion.button>
        );
      })}
    </div>
  );
}
