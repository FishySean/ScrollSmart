"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import TopicSelector from "@/components/TopicSelector";
import { api } from "@/lib/api";

type Step = "register" | "topics";

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
    setStep("topics");
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
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center px-4 py-12 overflow-y-auto">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#6c63ff] opacity-[0.04] rounded-full blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        {step === "register" ? (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            {/* Logo */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="inline-flex items-center gap-2 mb-4"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#a855f7] flex items-center justify-center text-xl">
                  ✦
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">ScrollSmart</span>
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
              <p className="text-[#9999bb] text-sm">
                AI-powered knowledge that learns what you love
              </p>
            </div>

            <form onSubmit={handleRegisterNext} className="space-y-4">
              <div>
                <label className="block text-sm text-[#9999bb] mb-1.5 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#12122a] border border-[#2a2a4a] rounded-xl px-4 py-3 text-white placeholder-[#55557a] focus:outline-none focus:border-[#6c63ff] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.15)] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-[#9999bb] mb-1.5 font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#12122a] border border-[#2a2a4a] rounded-xl px-4 py-3 text-white placeholder-[#55557a] focus:outline-none focus:border-[#6c63ff] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.15)] transition-all"
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
                whileTap={{ scale: 0.97 }}
                className="w-full bg-gradient-to-r from-[#6c63ff] to-[#a855f7] text-white font-semibold py-3 rounded-xl mt-2 hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(108,99,255,0.3)]"
              >
                Continue →
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="topics"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-3xl"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">What sparks your curiosity?</h1>
              <p className="text-[#9999bb] text-sm">
                Select at least 3 topics — your feed will be tailored to these
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-[#12122a] border border-[#2a2a4a] rounded-full px-4 py-1.5">
                <span className="text-[#6c63ff] font-bold text-sm">{selectedTopics.length}</span>
                <span className="text-[#9999bb] text-xs">selected</span>
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
                className="px-6 py-3 rounded-xl border border-[#2a2a4a] text-[#9999bb] hover:text-white hover:border-[#4a4a6a] transition-all text-sm"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
