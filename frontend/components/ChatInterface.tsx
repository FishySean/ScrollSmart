"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  userId: string;
  cardId: string;
  topic: string;
  hookMessage: string;
  onMessageSent: () => void;
  goDeeperTrigger?: string | null;
}

export default function ChatInterface({
  userId,
  cardId,
  topic,
  hookMessage,
  onMessageSent,
  goDeeperTrigger,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-send when Go Deeper is triggered
  useEffect(() => {
    if (goDeeperTrigger) {
      sendMessage(goDeeperTrigger);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goDeeperTrigger]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMsg: Message = { role: "user", content: messageText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    onMessageSent();

    try {
      const res = await api.sendMessage({
        user_id: userId,
        card_id: cardId,
        topic,
        message: messageText,
        chat_history: [
          { role: "assistant", content: hookMessage },
          ...newMessages.map((m) => ({ role: m.role, content: m.content })),
        ],
      });

      setMessages([...newMessages, { role: "assistant", content: res.response }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, I had trouble responding. Try again?" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Message history */}
      <div className="flex-1 overflow-y-auto chat-scroll space-y-3 py-2 px-1 min-h-0">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#6c63ff] text-white rounded-br-sm"
                    : "bg-white/8 border border-white/8 text-[#e0e0f0] rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/8 border border-white/8 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [-3, 0, -3] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                  className="w-1.5 h-1.5 bg-[#6c63ff] rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-2 items-center">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          disabled={loading}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#6c63ff]/60 focus:bg-white/8 transition-all"
        />
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="w-9 h-9 flex-shrink-0 rounded-xl bg-[#6c63ff] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#7c73ff] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
