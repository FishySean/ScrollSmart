from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()


class OnboardingData(BaseModel):
    topics: List[str]


@router.post("/onboarding")
async def save_onboarding_topics(data: OnboardingData):

    print(f"用户选择了这些主题: {data.topics}")
    

    return {"status": "success", "message": "Preferences saved!"}
from fastapi import APIRouter, HTTPException
from ..models.schemas import (
    RegisterRequest, RegisterResponse,
    FeedNextRequest, FeedCard,
    EngageRequest, EngageResponse,
    ChatRequest, ChatResponse,
    ProfileResponse,
)
from ..models.storage import create_user, get_profile, get_top_topics
from ..agents.pipeline import (
    generate_next_card,
    process_engagement_and_get_next,
    handle_chat_message,
)

router = APIRouter(prefix="/api")


@router.post("/register", response_model=RegisterResponse)
async def register(body: RegisterRequest):
    if len(body.selected_topics) < 3:
        raise HTTPException(status_code=400, detail="Please select at least 3 topics")

    user_id = create_user(body.email, body.selected_topics)
    profile = get_profile(user_id)

    return RegisterResponse(user_id=user_id, profile=profile)


@router.post("/feed/next", response_model=FeedCard)
async def get_next_feed_card(body: FeedNextRequest):
    profile = get_profile(body.user_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        card = generate_next_card(body.user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate card: {str(e)}")

    return FeedCard(**card)


@router.post("/feed/engage", response_model=EngageResponse)
async def engage_with_card(body: EngageRequest):
    profile = get_profile(body.user_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        updated_profile = process_engagement_and_get_next(
            user_id=body.user_id,
            topic=body.topic,
            liked=body.liked,
            disliked=body.disliked,
            went_deeper=body.went_deeper,
            conversation_depth=body.conversation_depth,
            time_on_card=body.time_on_card,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process engagement: {str(e)}")

    return EngageResponse(updated_profile=updated_profile)


@router.post("/chat/message", response_model=ChatResponse)
async def send_chat_message(body: ChatRequest):
    profile = get_profile(body.user_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="User not found")

    history = [{"role": m.role, "content": m.content} for m in body.chat_history]

    try:
        response = handle_chat_message(
            user_id=body.user_id,
            card_id=body.card_id,
            topic=body.topic,
            message=body.message,
            chat_history=history,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

    return ChatResponse(response=response)


@router.get("/profile/{user_id}", response_model=ProfileResponse)
async def get_user_profile(user_id: str):
    profile = get_profile(user_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="User not found")

    top_topics = get_top_topics(profile, n=10)

    return ProfileResponse(
        interest_profile=profile,
        top_topics=top_topics,
    )
