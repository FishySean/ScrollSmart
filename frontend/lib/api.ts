const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface UserProfile {
  [topic: string]: number;
}

export interface RegisterResponse {
  user_id: string;
  profile: UserProfile;
}

export interface FeedCard {
  card_id: string;
  topic: string;
  hook_message: string;
  music_name?: string;
}

export interface EngageResponse {
  updated_profile: UserProfile;
}

export interface ChatResponse {
  response: string;
}

export interface ProfileResponse {
  interest_profile: UserProfile;
  top_topics: [string, number][];
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  register: (email: string, password: string, selected_topics: string[]) =>
    request<RegisterResponse>("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password, selected_topics }),
    }),

  getNextCard: (user_id: string) =>
    request<FeedCard>("/api/feed/next", {
      method: "POST",
      body: JSON.stringify({ user_id }),
    }),

  engage: (data: {
    user_id: string;
    card_id: string;
    topic: string;
    liked: boolean;
    disliked: boolean;
    went_deeper: boolean;
    conversation_depth: number;
    time_on_card: number;
  }) =>
    request<EngageResponse>("/api/feed/engage", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  sendMessage: (data: {
    user_id: string;
    card_id: string;
    topic: string;
    message: string;
    chat_history: { role: string; content: string }[];
  }) =>
    request<ChatResponse>("/api/chat/message", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getProfile: (user_id: string) =>
    request<ProfileResponse>(`/api/profile/${user_id}`),
};
