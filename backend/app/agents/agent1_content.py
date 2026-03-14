"""
Agent 1 — Content Generator
Responsible for:
1. Generating the opening "hook" message for a knowledge card
2. Handling ongoing conversation within a card

Uses a completely separate OpenAI client and system prompt from Agent 2.
Does NOT share context or history with Agent 2.
"""

import os
from openai import OpenAI

_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    return _client


AGENT1_SYSTEM_PROMPT = """You are an elite science communicator and educator — the kind of person who can make anyone fall in love with any field of knowledge. Your role is to generate engaging, surprising "hook" messages that open knowledge conversations.

Your personality:
- Intellectually curious and enthusiastic, but never condescending
- You love counterintuitive facts, surprising connections, and mind-expanding ideas
- You write conversationally, like a brilliant friend explaining something over coffee
- You never use jargon without immediately making it accessible

When generating a HOOK MESSAGE:
- Start with the most surprising, counterintuitive, or fascinating angle on the topic
- Keep it to 3-5 sentences maximum
- End with an implicit invitation for the user to engage (but do NOT explicitly say "what do you think?")
- Make the user feel like they just learned something that will change how they see the world
- Vary your format: sometimes start with a fact, sometimes with a question, sometimes with a scenario

When responding to user messages in ONGOING CONVERSATION:
- Stay focused on the topic you were assigned
- Build on what the user says
- Go progressively deeper based on their questions
- Use analogies, examples, and thought experiments
- Keep responses concise (2-4 sentences for simple questions, more for complex ones)
- Never be dismissive of any question — every question is an opportunity

Remember: your goal is to make learning feel like the most exciting thing a person can do."""


def generate_hook(topic: str, profile_summary: str, model: str = "gpt-4o-mini") -> str:
    """
    Generate the opening hook message for a knowledge card.

    Args:
        topic: The topic for this card (e.g., "Neuroscience")
        profile_summary: Natural language description of user's interest profile
        model: OpenAI model to use
    """
    client = _get_client()

    user_prompt = f"""Generate an opening hook message for a knowledge card about: {topic}

User interest context: {profile_summary}

Generate a hook that is surprising, counterintuitive, or fascinating about {topic}. 
Make it feel personalized and relevant. 3-5 sentences max."""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": AGENT1_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.9,
        max_tokens=300,
    )

    return response.choices[0].message.content or ""


def continue_conversation(
    topic: str,
    user_message: str,
    chat_history: list[dict],
    model: str = "gpt-4o-mini",
) -> str:
    """
    Continue an ongoing conversation within a knowledge card.

    Args:
        topic: The topic of this card
        user_message: The user's latest message
        chat_history: Previous messages in the conversation [{"role": ..., "content": ...}]
        model: OpenAI model to use
    """
    client = _get_client()

    system_with_topic = (
        AGENT1_SYSTEM_PROMPT
        + f"\n\nYou are currently in a conversation about: {topic}. "
        f"Stay on this topic and help the user explore it deeply."
    )

    messages = [{"role": "system", "content": system_with_topic}]
    messages.extend(chat_history)
    messages.append({"role": "user", "content": user_message})

    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.8,
        max_tokens=400,
    )

    return response.choices[0].message.content or ""
