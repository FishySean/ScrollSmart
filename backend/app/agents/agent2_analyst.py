"""
Agent 2 — Profile Analyst
Responsible for:
1. Analyzing engagement data and updating the user's interest profile JSON
2. Deciding the topic for the NEXT card (80/20 exploitation/exploration)

Uses a completely separate OpenAI client and system prompt from Agent 1.
Does NOT share context or history with Agent 1.
"""

import os
import json
from openai import OpenAI
from ..models.storage import (
    apply_engagement_delta, get_profile, update_profile
)
from ..models.topic_selector import select_next_topic

_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    return _client


AGENT2_SYSTEM_PROMPT = """You are a sophisticated user interest profile analyst. Your job is to interpret user engagement signals and build a nuanced understanding of their intellectual interests.

You receive engagement data from a knowledge card interaction and must:
1. Analyze what the engagement signals mean about the user's interest level
2. Suggest how to update the interest profile weights
3. Generate a natural-language summary of the user's interest profile for use by the content generator

You understand that:
- Strong engagement (liking, going deeper, long conversations) = high interest
- Passive scrolling (short time, no interaction) = low/neutral interest  
- Disliking = negative signal, reduce that topic's weight
- Time spent is a strong implicit signal (people don't linger on things they don't care about)
- Multiple messages = the user is genuinely curious, not just clicking

When generating a profile summary, make it rich and contextual:
- Note not just which topics are high, but what the distribution suggests about the person
- Look for patterns (e.g., "interested in the scientific/empirical side of human behavior")
- Keep it to 2-3 sentences that would help a content generator personalize its output

Be analytical, precise, and insightful. You are the intelligence layer of this system."""


def analyze_and_update_profile(
    user_id: str,
    topic: str,
    liked: bool,
    disliked: bool,
    went_deeper: bool,
    conversation_depth: int,
    time_on_card: int,
) -> tuple[dict[str, float], str]:
    """
    Analyze engagement signals, update the user's profile, and return
    the updated profile along with a natural-language summary.

    Returns:
        (updated_profile, profile_summary_string)
    """
    current_profile = get_profile(user_id)
    if current_profile is None:
        raise ValueError(f"User {user_id} not found")

    updated_profile = apply_engagement_delta(
        current_profile,
        topic=topic,
        liked=liked,
        disliked=disliked,
        went_deeper=went_deeper,
        conversation_depth=conversation_depth,
        time_on_card=time_on_card,
    )

    update_profile(user_id, updated_profile)

    profile_summary = _generate_profile_summary(updated_profile)

    return updated_profile, profile_summary


def _generate_profile_summary(profile: dict[str, float]) -> str:
    """
    Generate a natural-language summary of the interest profile
    using Agent 2's LLM capabilities.
    """
    top_topics = sorted(profile.items(), key=lambda x: x[1], reverse=True)[:8]
    top_str = ", ".join(f"{t} ({w:.2f})" for t, w in top_topics)

    client = _get_client()

    prompt = f"""Based on this user's interest profile weights (topic: weight from 0.0 to 1.0):
Top topics: {top_str}

Write a 2-3 sentence natural-language summary of this person's intellectual interests and curiosities. 
This summary will be given to a content generator to help personalize knowledge cards.
Focus on the patterns, not just listing topics. Be insightful about what these interests suggest about the person."""

    response = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        messages=[
            {"role": "system", "content": AGENT2_SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        max_tokens=150,
    )

    return response.choices[0].message.content or _fallback_summary(profile)


def _fallback_summary(profile: dict[str, float]) -> str:
    """Simple fallback if LLM call fails."""
    top = sorted(profile.items(), key=lambda x: x[1], reverse=True)[:3]
    topics_str = ", ".join(t for t, _ in top)
    return f"The user shows strong interest in {topics_str} and related topics."


def get_next_topic_and_summary(user_id: str) -> tuple[str, str]:
    """
    Get the next recommended topic and a profile summary for content generation.
    Used when generating a new card WITHOUT prior engagement data.

    Returns:
        (next_topic, profile_summary)
    """
    profile = get_profile(user_id)
    if profile is None:
        raise ValueError(f"User {user_id} not found")

    next_topic = select_next_topic(profile)
    profile_summary = _generate_profile_summary(profile)

    return next_topic, profile_summary
