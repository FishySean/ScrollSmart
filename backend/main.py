from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.api.routes import router

load_dotenv()

app = FastAPI(title="ScrollSmart API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


from pydantic import BaseModel
from typing import List

class OnboardingData(BaseModel):
    topics: List[str]

@app.post("/onboarding")
async def handle_onboarding(data: OnboardingData):
    print("成功收到前端传来的标签:", data.topics)
    return {"status": "success"}
@app.get("/")
async def root():
    return {"message": "ScrollSmart API is running"}


@app.get("/health")
async def health():
    return {"status": "ok"}
