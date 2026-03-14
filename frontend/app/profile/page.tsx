"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { api, UserProfile } from "@/lib/api";

interface RadarDataPoint {
  topic: string;
  value: number;
  fullMark: number;
}

const TOP_TOPICS_FOR_RADAR = 12;

function buildRadarData(profile: UserProfile): RadarDataPoint[] {
  const sorted = Object.entries(profile)
    .sort(([, a], [, b]) => b - a)
    .slice(0, TOP_TOPICS_FOR_RADAR);

  return sorted.map(([topic, value]) => ({
    topic: topic.length > 12 ? topic.slice(0, 11) + "…" : topic,
    value: Math.round(value * 100) / 100,
    fullMark: 1,
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a35] border border-[#6c63ff]/30 rounded-lg px-3 py-2 text-xs text-white shadow-lg">
        <p className="font-medium">{payload[0]?.payload?.topic}</p>
        <p className="text-[#a09cff]">Interest: {(payload[0]?.value * 100).toFixed(0)}%</p>
      </div>
    );
  }
  return null;
};

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [topTopics, setTopTopics] = useState<[string, number][]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (uid: string) => {
    try {
      const res = await api.getProfile(uid);
      setProfile(res.interest_profile);
      setTopTopics(res.top_topics);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = localStorage.getItem("scrollsmart_user_id");
    if (!id) {
      router.replace("/onboarding");
      return;
    }
    setUserId(id);
    loadProfile(id);
  }, [router, loadProfile]);

  const radarData = profile ? buildRadarData(profile) : [];

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/5">
        <Link
          href="/feed"
          className="flex items-center gap-2 text-[#9999bb] hover:text-white transition-colors text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Back to Feed
        </Link>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#6c63ff] to-[#a855f7] flex items-center justify-center text-xs">
            ✦
          </div>
          <span className="text-white font-bold text-sm">ScrollSmart</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-white mb-1">Your Interest Profile</h1>
          <p className="text-[#9999bb] text-sm mb-8">
            Watch this evolve as you interact with more cards
          </p>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Radar Chart */}
              <div className="bg-[#12122a] border border-[#2a2a4a] rounded-2xl p-5 mb-6">
                <h2 className="text-sm font-semibold text-[#9999bb] uppercase tracking-wider mb-4">
                  Interest Radar
                </h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                      <PolarGrid
                        stroke="rgba(108, 99, 255, 0.15)"
                        gridType="polygon"
                      />
                      <PolarAngleAxis
                        dataKey="topic"
                        tick={{ fill: "rgba(153, 153, 187, 0.8)", fontSize: 10 }}
                        tickLine={false}
                      />
                      <Radar
                        name="Interest"
                        dataKey="value"
                        stroke="#6c63ff"
                        fill="#6c63ff"
                        fillOpacity={0.25}
                        strokeWidth={2}
                        dot={{ fill: "#6c63ff", r: 3 }}
                        animationDuration={800}
                        animationEasing="ease-out"
                      />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Topics List */}
              <div className="bg-[#12122a] border border-[#2a2a4a] rounded-2xl p-5">
                <h2 className="text-sm font-semibold text-[#9999bb] uppercase tracking-wider mb-4">
                  Topic Weights
                </h2>
                <div className="space-y-3">
                  {topTopics.map(([topic, weight], i) => (
                    <motion.div
                      key={topic}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-[#55557a] text-xs w-5 text-right">{i + 1}</span>
                      <span className="text-[#e8e8f0] text-sm flex-1 font-medium">{topic}</span>
                      <div className="flex items-center gap-2 w-32">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${weight * 100}%` }}
                            transition={{ delay: i * 0.04 + 0.2, duration: 0.6, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, #6c63ff, #a855f7)`,
                              boxShadow: "0 0 6px rgba(108,99,255,0.4)",
                            }}
                          />
                        </div>
                        <span className="text-[#9999bb] text-xs w-8 text-right">
                          {(weight * 100).toFixed(0)}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Refresh button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => userId && loadProfile(userId)}
                className="mt-4 w-full py-3 rounded-xl border border-[#2a2a4a] text-[#9999bb] text-sm hover:border-[#6c63ff]/40 hover:text-white transition-all"
              >
                ↻ Refresh Profile
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
