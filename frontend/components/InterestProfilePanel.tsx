"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { api, UserProfile } from "@/lib/api";

interface InterestProfilePanelProps {
  userId: string;
  variant?: "panel" | "split";
}

interface RadarDataPoint {
  topic: string;
  value: number;
  fullMark: number;
}

function buildRadarData(profile: UserProfile): RadarDataPoint[] {
  const ordered = Object.entries(profile);

  return ordered.map(([topic, value]) => ({
    topic: topic.length > 11 ? topic.slice(0, 10) + "..." : topic,
    value: Math.round(value * 100) / 100,
    fullMark: 1,
  }));
}

interface TooltipPayloadItem {
  value?: ValueType;
  name?: NameType;
  payload?: {
    topic?: string;
    value?: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const topic = payload[0]?.payload?.topic;
    const value = payload[0]?.payload?.value;
    return (
      <div className="bg-[#14142d] border border-[#6c63ff]/30 rounded-lg px-3 py-2 text-xs text-white shadow-lg">
        <p className="font-medium">{topic}</p>
        <p className="text-[#a09cff]">Interest: {((value ?? 0) * 100).toFixed(0)}%</p>
      </div>
    );
  }

  return null;
};

export default function InterestProfilePanel({
  userId,
  variant = "panel",
}: InterestProfilePanelProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [topicWeights, setTopicWeights] = useState<[string, number][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.getProfile(userId);
      setProfile(res.interest_profile);
      setTopicWeights(
        Object.entries(res.interest_profile).sort(([, a], [, b]) => b - a)
      );
    } catch {
      setError("Could not load profile right now.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const radarData = profile ? buildRadarData(profile) : [];
  const isSplit = variant === "split";
  const radarMax = Math.max(
    0.3,
    Math.ceil((Math.max(...radarData.map((item) => item.value), 0.15) + 0.01) / 0.05) * 0.05
  );

  const renderRadarCard = (heightClass: string) => (
    <div className="flex h-full min-h-0 flex-col rounded-3xl border border-[#2a2a4a] bg-[rgba(18,18,42,0.92)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#7a7aa3]">Live Profile</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Interest Radar</h2>
          <p className="mt-1 text-sm text-[#9999bb]">
            Your strongest topics reshape this map in real time.
          </p>
        </div>
      </div>
      <div className={`min-h-0 flex-1 ${heightClass}`}>
        <div className="relative h-full w-full">
          <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(108,99,255,0.12)_0%,rgba(108,99,255,0.05)_38%,rgba(108,99,255,0)_72%)] blur-2xl" />
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
              <PolarGrid stroke="rgba(108, 99, 255, 0.2)" strokeWidth={1.2} gridType="polygon" />
              <PolarAngleAxis
                dataKey="topic"
                tick={{ fill: "rgba(153, 153, 187, 0.82)", fontSize: isSplit ? 14 : 10 }}
                tickLine={false}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, radarMax]}
                tickCount={5}
                axisLine={false}
                tick={{ fill: "rgba(153, 153, 187, 0.45)", fontSize: isSplit ? 11 : 9 }}
                tickFormatter={(value) => `${Math.round(value * 100)}%`}
              />
              <Radar
                name="Interest"
                dataKey="value"
                stroke="#8f6bff"
                fill="#7d5cff"
                fillOpacity={0.38}
                strokeWidth={isSplit ? 3.5 : 2.4}
                dot={{ fill: "#a78bfa", r: isSplit ? 6 : 4, strokeWidth: 1.5, stroke: "#1a1738" }}
                animationDuration={850}
                animationEasing="ease-out"
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderWeightsCard = () => (
    <div className="flex h-full min-h-0 flex-col rounded-3xl border border-[#2a2a4a] bg-[rgba(18,18,42,0.92)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#7a7aa3]">Live Profile</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Topic Weights</h2>
          <p className="mt-1 text-sm text-[#9999bb]">
            Small changes add up as the user scrolls and reacts.
          </p>
        </div>
        <button
          onClick={loadProfile}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#c9c9e8] hover:border-[#6c63ff]/40 hover:text-white transition-all"
        >
          Refresh
        </button>
      </div>
      <div className="max-h-[calc(100vh-16rem)] space-y-4 overflow-y-auto pr-1">
        {topicWeights.map(([topic, weight], index) => (
          <div key={topic} className="flex items-center gap-4">
            <span className="w-6 text-right text-sm text-[#55557a]">{index + 1}</span>
            <span className="flex-1 text-lg font-medium text-[#e8e8f0]">{topic}</span>
            <div className="flex w-44 items-center gap-3">
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#6c63ff] to-[#a855f7]"
                  style={{ width: `${weight * 100}%` }}
                />
              </div>
              <span className="w-12 text-right text-base text-[#c7c7e8]">
                {(weight * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderErrorCard = () => (
    <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
      {error}
    </div>
  );

  const renderLoadingCard = (heightClass: string) => (
    <div className="rounded-3xl border border-[#2a2a4a] bg-[rgba(18,18,42,0.92)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className={`flex items-center justify-center ${heightClass}`}>
        <div className="w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (isSplit) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="hidden w-full xl:block"
      >
        <div className="mx-auto grid h-[calc(100vh-7.5rem)] max-w-[1720px] grid-cols-[minmax(0,1.7fr)_minmax(500px,0.9fr)] gap-6 rounded-[32px] border border-[#2a2a4a] bg-[rgba(10,10,26,0.82)] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
          <div className="h-full">
            {loading ? renderLoadingCard("h-full min-h-[620px]") : error ? renderErrorCard() : renderRadarCard("min-h-[620px]")}
          </div>
          <div className="h-full">
            {loading ? renderLoadingCard("h-full min-h-[620px]") : error ? renderErrorCard() : renderWeightsCard()}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.98 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="w-[min(92vw,420px)] max-h-[calc(100vh-5.5rem)] overflow-hidden rounded-3xl border border-[#2a2a4a] bg-[rgba(10,10,26,0.94)] shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
    >
      <div className="max-h-[calc(100vh-11rem)] overflow-y-auto px-5 py-4">
        {loading ? (
          renderLoadingCard("h-64")
        ) : error ? (
          renderErrorCard()
        ) : (
          <div className="space-y-4">
            {renderRadarCard("h-64")}
            {renderWeightsCard()}
          </div>
        )}
      </div>
    </motion.div>
  );
}
