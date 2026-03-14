"""
80/20 Exploitation/Exploration topic selection logic.
- 80% exploit: pick from the user's highest-weight topics (weighted random)
- 20% explore: pick from lower-weight or unseen topics (random)
"""

import random
from .storage import ALL_TOPICS, MIN_WEIGHT


def select_next_topic(profile: dict[str, float]) -> str:
    """
    Select the next topic using the 80/20 rule.
    Returns the topic string.
    """
    sorted_topics = sorted(profile.items(), key=lambda x: x[1], reverse=True)

    # Split into top half (exploit pool) and bottom half (explore pool)
    midpoint = max(1, len(sorted_topics) // 2)
    exploit_pool = sorted_topics[:midpoint]
    explore_pool = sorted_topics[midpoint:]

    # Add any unseen topics (not in profile) to explore pool
    seen = set(profile.keys())
    unseen = [(t, MIN_WEIGHT) for t in ALL_TOPICS if t not in seen]
    explore_pool = explore_pool + unseen

    roll = random.random()

    if roll < 0.8 and exploit_pool:
        # Weighted random choice from top topics
        topics, weights = zip(*exploit_pool)
        chosen = random.choices(list(topics), weights=list(weights), k=1)[0]
    else:
        # Pure random from explore pool
        if explore_pool:
            topics_only = [t for t, _ in explore_pool]
            chosen = random.choice(topics_only)
        else:
            # Fallback: any topic
            topics, weights = zip(*exploit_pool)
            chosen = random.choices(list(topics), weights=list(weights), k=1)[0]

    return chosen
