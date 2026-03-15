"""
In-memory storage for user sessions and profiles.
Intentionally simple for hackathon — no database needed.
"""

import uuid
from typing import Optional

# All topics available in the app
ALL_TOPICS = [
    "Fitness", "Psychology", "Quantum Physics", "Personal Finance",
    "History", "Philosophy", "Programming", "Nutrition", "Astronomy",
    "Linguistics", "Evolutionary Biology", "Neuroscience", "Climate Science",
    "Geopolitics", "Stoicism", "Mathematics", "Architecture",
    "Behavioral Economics", "Music Theory", "Cryptography",
    "Ancient Civilizations", "Robotics", "Ethics", "Cognitive Science",
    "Astrophysics",
]

COLD_START_WEIGHT = 0.15
DEFAULT_WEIGHT = 0.1
MIN_WEIGHT = 0.05
MAX_WEIGHT = 1.0

# Delta values for engagement signals
LIKE_DELTA = 0.15
DISLIKE_DELTA = -0.1
GO_DEEPER_DELTA = 0.2
PER_MESSAGE_DELTA = 0.05
LONG_TIME_DELTA = 0.1
LONG_TIME_THRESHOLD = 30  # seconds

# {user_id: {"email": str, "profile": {topic: float}}}
users: dict[str, dict] = {}


def create_user(email: str, selected_topics: list[str]) -> str:
    user_id = str(uuid.uuid4())
    profile: dict[str, float] = {}
    for topic in ALL_TOPICS:
        if topic in selected_topics:
            profile[topic] = COLD_START_WEIGHT
        else:
            profile[topic] = DEFAULT_WEIGHT
    users[user_id] = {"email": email, "profile": profile}
    return user_id


def get_profile(user_id: str) -> Optional[dict[str, float]]:
    user = users.get(user_id)
    if user:
        return user["profile"].copy()
    return None


def update_profile(user_id: str, new_profile: dict[str, float]) -> None:
    if user_id in users:
        users[user_id]["profile"] = new_profile


def apply_engagement_delta(
    profile: dict[str, float],
    topic: str,
    liked: bool,
    disliked: bool,
    went_deeper: bool,
    conversation_depth: int,
    time_on_card: int,
) -> dict[str, float]:
    """Apply engagement signals to a topic's weight in the profile."""
    updated = profile.copy()

    if topic not in updated:
        updated[topic] = DEFAULT_WEIGHT

    delta = 0.0
    if liked:
        delta += LIKE_DELTA
    if disliked:
        delta += DISLIKE_DELTA
    if went_deeper:
        delta += GO_DEEPER_DELTA
    if conversation_depth > 0:
        delta += min(conversation_depth * PER_MESSAGE_DELTA, 0.3)
    if time_on_card >= LONG_TIME_THRESHOLD:
        delta += LONG_TIME_DELTA

    updated[topic] = max(MIN_WEIGHT, min(MAX_WEIGHT, updated[topic] + delta))

    updated = _normalize_profile(updated)
    return updated


def _normalize_profile(profile: dict[str, float]) -> dict[str, float]:
    """
    Soft normalization: prevent all topics from converging upward too quickly.
    If the average weight exceeds 0.6, scale down proportionally.
    """
    values = list(profile.values())
    avg = sum(values) / len(values) if values else 0

    if avg > 0.6:
        scale = 0.6 / avg
        return {k: max(MIN_WEIGHT, min(MAX_WEIGHT, v * scale)) for k, v in profile.items()}

    return profile


def get_top_topics(profile: dict[str, float], n: int = 10) -> list[tuple[str, float]]:
    return sorted(profile.items(), key=lambda x: x[1], reverse=True)[:n]
