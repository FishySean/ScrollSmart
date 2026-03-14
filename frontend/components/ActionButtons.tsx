"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ActionButtonsProps {
  onLike: () => void;
  onDislike: () => void;
  onGoDeeper: () => void;
  liked: boolean;
  disliked: boolean;
}

export default function ActionButtons({
  onLike,
  onDislike,
  onGoDeeper,
  liked,
  disliked,
}: ActionButtonsProps) {
  const [deeperClicked, setDeeperClicked] = useState(false);

  const handleGoDeeper = () => {
    setDeeperClicked(true);
    onGoDeeper();
  };

  return (
    <div className="flex items-center gap-3">
      {/* Like */}
      <motion.button
        whileTap={{ scale: 0.75 }}
        onClick={onLike}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 btn-bounce ${
          liked
            ? "bg-green-500/20 border border-green-500/60 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.3)]"
            : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
        }`}
      >
        <motion.span
          animate={liked ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          👍
        </motion.span>
        <span>Like</span>
      </motion.button>

      {/* Dislike */}
      <motion.button
        whileTap={{ scale: 0.75 }}
        onClick={onDislike}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 btn-bounce ${
          disliked
            ? "bg-red-500/20 border border-red-500/60 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
            : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
        }`}
      >
        <motion.span
          animate={disliked ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          👎
        </motion.span>
        <span>Skip</span>
      </motion.button>

      {/* Go Deeper */}
      <motion.button
        whileTap={{ scale: 0.75 }}
        onClick={handleGoDeeper}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 btn-bounce ${
          deeperClicked
            ? "bg-[#6c63ff]/30 border border-[#6c63ff]/70 text-[#a09cff] shadow-[0_0_12px_rgba(108,99,255,0.4)]"
            : "bg-[#6c63ff]/10 border border-[#6c63ff]/30 text-[#9999cc] hover:bg-[#6c63ff]/20 hover:text-white"
        }`}
      >
        <motion.span
          animate={deeperClicked ? { rotate: [0, 360] } : {}}
          transition={{ duration: 0.5 }}
        >
          🔍
        </motion.span>
        <span>Go Deeper</span>
      </motion.button>
    </div>
  );
}
