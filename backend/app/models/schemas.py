from pydantic import BaseModel, Field
from typing import Optional


class RegisterRequest(BaseModel):
    email: str
    password: str
    selected_topics: list[str]


class RegisterResponse(BaseModel):
    user_id: str
    profile: dict[str, float]


class FeedNextRequest(BaseModel):
    user_id: str


class FeedCard(BaseModel):
    card_id: str
    topic: str
    hook_message: str
    pregenerated_elaboration: Optional[str] = None


class EngageRequest(BaseModel):
    user_id: str
    card_id: str
    topic: str
    liked: bool = False
    disliked: bool = False
    went_deeper: bool = False
    conversation_depth: int = 0
    time_on_card: int = 0


class EngageResponse(BaseModel):
    updated_profile: dict[str, float]


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    user_id: str
    card_id: str
    topic: str
    message: str
    chat_history: list[ChatMessage] = Field(default_factory=list)


class ChatResponse(BaseModel):
    response: str


class ProfileResponse(BaseModel):
    interest_profile: dict[str, float]
    top_topics: list[tuple[str, float]]
