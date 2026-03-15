"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import TopicSelector from "@/components/TopicSelector";
import RegisterBackground from "@/components/RegisterBackground";
import { api } from "@/lib/api";

type Step = "register" | "cosmic" | "topics";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegisterNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    setStep("cosmic");
  };

  const handleFinish = async () => {
    if (selectedTopics.length < 3) {
      setError("Please select at least 3 topics");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.register(email, password, selectedTopics);
      localStorage.setItem("scrollsmart_user_id", res.user_id);
      router.push("/feed");
    } catch {
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col overflow-y-auto">
      {/* 图一全局固定背景 + 图三/图四 overlay：仅 cosmic 或 topics 时显示 */}
      <AnimatePresence mode="wait">
        {(step === "cosmic" || step === "topics") && (
          <motion.div
            key="post-continue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[5] flex flex-col"
          >
            {/* 背景由 layout 的 StarTrailBackground 统一提供 */}
            {/* 极淡遮罩，仅略提可读性 */}
            <div
              className="absolute inset-0 z-[6] pointer-events-none"
              style={{ background: "rgba(0,0,0,0.12)" }}
            />
            {/* 3. 图三：纯图，点击进入图四 */}
            {step === "cosmic" && (
              <div
                className="absolute inset-0 z-[7] cursor-pointer"
                onClick={() => setStep("topics")}
                onKeyDown={(e) => e.key === "Enter" && setStep("topics")}
                role="button"
                tabIndex={0}
                aria-label="Continue"
              />
            )}
            {/* 4. 图四：话题选择，作为 overlay */}
            {step === "topics" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative z-[7] flex-1 flex flex-col min-h-screen overflow-y-auto"
              >
                <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-center px-4 py-12">
                  <div className="text-center mb-8">
                    <h1
                      className="text-3xl font-bold text-white mb-2"
                      style={{ textShadow: "0 2px 16px rgba(0,0,0,0.8), 0 0 32px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.9)" }}
                    >
                      What sparks your curiosity?
                    </h1>
                    <p
                      className="text-white/95 text-sm"
                      style={{ textShadow: "0 1px 10px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.4)" }}
                    >
                      Select at least 3 topics — your feed will be tailored to these
                    </p>
                    <div
                      className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 border border-white/25 text-sm"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.25)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
                      }}
                    >
                      <span className="text-[#6c63ff] font-bold">{selectedTopics.length}</span>
                      <span className="text-[#b0b0d0] text-xs">selected</span>
                      {selectedTopics.length >= 3 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-green-400 text-xs"
                        >
                          ✓ Ready
                        </motion.span>
                      )}
                    </div>
                  </div>

                  <TopicSelector selected={selectedTopics} onChange={setSelectedTopics} />

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm text-center mt-4"
                    >
                      {error}
                    </motion.p>
                  )}

                  <div className="flex gap-3 mt-8 justify-center">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setStep("register"); setError(""); }}
                      className="px-6 py-3 rounded-xl text-white/95 hover:text-white transition-all text-sm border border-white/25"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.25)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
                      }}
                    >
                      ← Back
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleFinish}
                      disabled={loading || selectedTopics.length < 3}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#6c63ff] to-[#a855f7] text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(108,99,255,0.3)]"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Setting up your feed...
                        </span>
                      ) : (
                        "Start Scrolling →"
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {step === "register" ? (
          <motion.div
            key="register"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative min-h-screen flex flex-col"
          >
            {/* 第一个页面专用：中央粒子球 + 弯月 + 星座 + 星空 */}
            <RegisterBackground />
            {/* 远山剪影 — 叠加在星云之上 */}
            <div className="absolute bottom-0 left-0 right-0 h-[50%] min-h-[280px] pointer-events-none z-[1]">
              <svg
                className="w-full h-full object-cover object-bottom"
                preserveAspectRatio="xMidYMax meet"
                viewBox="0 0 1200 400"
              >
              <defs>
                <linearGradient id="mountainFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0a0a1a" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#050510" stopOpacity="1" />
                </linearGradient>
              </defs>
              <g fill="url(#mountainFill)">
                <path d="M0,400 Q150,250 300,280 Q500,220 650,260 Q800,230 950,255 Q1100,235 1200,265 L1200,400 Z" opacity="0.95" />
                <path d="M0,400 Q100,330 280,335 Q450,310 580,340 Q720,325 860,345 Q980,330 1200,350 L1200,400 Z" opacity="0.88" />
                <path d="M0,400 Q80,370 240,378 Q420,368 560,378 Q720,372 880,378 Q1020,374 1200,382 L1200,400 Z" opacity="0.82" />
              </g>
            </svg>
            </div>

            {/* 顶部导航栏 */}
            <header className="relative z-10 flex items-center justify-between px-4 pt-12 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c63ff] to-[#a855f7] flex items-center justify-center text-sm">
                  ✦
                </div>
                <span className="text-lg font-bold text-white tracking-tight">ScrollSmart</span>
              </div>
              <div className="flex items-center gap-4 text-white/40">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </div>
            </header>

            {/* 主体区域 — 大标题 overlay 风格 */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-4 pb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-center mb-8"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight welcome-meteor-text">
                  Welcome
                </h1>
                <p className="text-white/70 text-base md:text-lg max-w-sm">
                  AI-powered knowledge that learns what you love
                </p>
                <p className="text-white/40 text-xs mt-4">— Find Out More</p>
              </motion.div>
            </div>

            {/* 底部表单区 — 星河过渡 */}
            <div
              className="relative z-10 px-4 pb-8 pt-4"
              style={{
                background: "linear-gradient(180deg, transparent 0%, rgba(5,5,20,0.5) 15%, rgba(10,10,50,0.85) 50%, rgba(5,5,25,0.95) 100%)",
              }}
            >
              <form onSubmit={handleRegisterNext} className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-[#6c63ff]/60 focus:bg-white/15 backdrop-blur-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-[#6c63ff]/60 focus:bg-white/15 backdrop-blur-sm transition-all"
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#6c63ff] to-[#a855f7] text-white font-semibold py-3.5 rounded-xl mt-2 hover:opacity-95 transition-opacity shadow-[0_0_24px_rgba(108,99,255,0.35)] flex items-center justify-center gap-2"
                >
                  Continue
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
