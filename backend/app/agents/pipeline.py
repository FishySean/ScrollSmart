"""
The Agent Pipeline:
Agent 2 → Agent 1 flow for generating knowledge cards.

Flow:
1. Agent 2 selects the next topic + generates profile summary
2. Agent 1 generates a hook using the topic + profile summary
3. Return the complete card data
"""

import uuid
from .agent1_content import generate_hook, continue_conversation
from .agent2_analyst import get_next_topic_and_summary, analyze_and_update_profile


def generate_next_card(user_id: str) -> dict:
    """
    Full pipeline: Agent 2 picks topic → Agent 1 generates hook.

    Returns:
        {card_id, topic, hook_message}
    """
    next_topic, profile_summary = get_next_topic_and_summary(user_id)

    hook_message = generate_hook(
        topic=next_topic,
        profile_summary=profile_summary,
    )

    return {
        "card_id": str(uuid.uuid4()),
        "topic": next_topic,
        "hook_message": hook_message,
    }


def process_engagement_and_get_next(
    user_id: str,
    topic: str,
    liked: bool,
    disliked: bool,
    went_deeper: bool,
    conversation_depth: int,
    time_on_card: int,
) -> dict[str, float]:
    """
    Agent 2: process engagement signals and update profile.
    Returns the updated profile (next card generation is separate).
    """
    updated_profile, _ = analyze_and_update_profile(
        user_id=user_id,
        topic=topic,
        liked=liked,
        disliked=disliked,
        went_deeper=went_deeper,
        conversation_depth=conversation_depth,
        time_on_card=time_on_card,
    )
    return updated_profile


def handle_chat_message(
    user_id: str,
    card_id: str,
    topic: str,
    message: str,
    chat_history: list[dict],
) -> str:
    """
    Agent 1: handle a user message in the chat interface.
    Returns the AI response string.
    """
    return continue_conversation(
        topic=topic,
        user_message=message,
        chat_history=chat_history,
    )
