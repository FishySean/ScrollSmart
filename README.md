# ScrollSmart

ScrollSmart is a TikTok-style AI knowledge feed. Instead of short entertainment videos, users scroll through AI-generated knowledge cards that adapt to their interests over time.

The goal of the project is to turn doomscrolling into something more meaningful: users still get a smooth, swipe-driven experience, but each card teaches them something new, encourages curiosity, and helps them discover what they are actually interested in.

## What the project does

ScrollSmart combines three ideas:

- a short-form scrolling interface like TikTok
- personalized AI-generated educational content
- a live interest profile that evolves as the user interacts

Users can:

- register and choose topics they are curious about
- scroll through personalized knowledge cards
- like, dislike, or skip content
- click `Go Deeper` to continue exploring a topic
- ask follow-up questions in a chat box
- open a live profile view to see how their topic interests are changing

## Why it is interesting

Most AI products are reactive: users must already know what they want to ask.
ScrollSmart is different. It proactively starts the learning experience, gives the user something interesting to react to, and then helps them discover better questions through interaction.

This makes it a useful experiment in AI + education + recommendation design.

## How it works

### 1. Topic onboarding

When a user signs up, they choose at least 3 topics they care about.
Those choices initialize the user's interest profile.

### 2. Two-agent backend flow

The backend uses two separate AI roles:

- Agent 2: analyzes user preferences and chooses the next topic
- Agent 1: generates the actual card content for that topic

### 3. Interest learning

The system updates topic weights based on how the user behaves:

- `Like`
- `Dislike / Skip`
- `Go Deeper`
- chat depth
- time spent on a card

### 4. Explore vs exploit

Topic selection follows an 80/20 strategy:

- 80% of the time, the system chooses from stronger-interest topics
- 20% of the time, it explores weaker topics to avoid getting repetitive

### 5. Live profile visualization

The profile view shows:

- a radar chart of topic interest
- topic weights as percentages

This makes the recommendation system more visible and interpretable to the user.

## Tech stack

- Frontend: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Recharts
- Backend: FastAPI, Python
- AI: OpenAI API
- Storage: in-memory Python dictionaries

## Project structure

```text
ScrollSmart/
├── frontend/
│   ├── app/
│   │   ├── onboarding/page.tsx
│   │   ├── feed/page.tsx
│   │   ├── profile/page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── FeedContainer.tsx
│   │   ├── KnowledgeCard.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── InterestProfilePanel.tsx
│   │   └── TopicSelector.tsx
│   └── lib/api.ts
├── backend/
│   ├── main.py
│   ├── app/
│   │   ├── api/routes.py
│   │   ├── agents/
│   │   │   ├── agent1_content.py
│   │   │   ├── agent2_analyst.py
│   │   │   └── pipeline.py
│   │   └── models/
│   │       ├── storage.py
│   │       ├── topic_selector.py
│   │       └── schemas.py
│   └── test_models.py
├── start.sh
└── README.md
```

## Requirements

Before running the project, make sure you have:

- Node.js 18 or newer
- Python 3.11 or newer
- an OpenAI API key

## How to run the project after downloading or cloning it

### Option 1: easiest workflow

Set up the backend and frontend once, then use the root start script.

### Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`.
You can either copy from `backend/.env.example` or create it manually.
At minimum, it should contain:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

### Frontend setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

The frontend uses `NEXT_PUBLIC_API_URL` from `.env.local`.
For local development it should point to:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Start both servers

From the project root:

```bash
bash start.sh
```

Then open:

- Frontend: `http://localhost:3000`
- Backend health check: `http://localhost:8000/health`
- API docs: `http://localhost:8000/docs`

## How to run manually in two terminals

If you prefer to see backend and frontend separately, use two terminal windows.

### Terminal 1: backend

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

### Terminal 2: frontend

```bash
cd frontend
npm run dev
```

Then open `http://localhost:3000`.

## Main API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/register` | Create a user and initialize the interest profile |
| `POST` | `/api/feed/next` | Generate the next feed card |
| `POST` | `/api/feed/engage` | Send card interaction data and update the profile |
| `POST` | `/api/chat/message` | Continue the conversation on a card |
| `GET` | `/api/profile/{user_id}` | Get the user's interest profile |

## Notes and limitations

- This project uses in-memory storage only.
- If the backend restarts, user data is lost.
- Because of that, you may need to register again after restarting the backend.
- The app depends on a working OpenAI API key.
- If the page loads forever, the most common cause is that the backend is not running or the API key is missing/invalid.

## Quick troubleshooting

### The frontend says `next: command not found`

Run:

```bash
cd frontend
npm install
```

### The backend says `venv/bin/activate: No such file or directory`

Run:

```bash
cd backend
python3 -m venv venv
```

### The app keeps spinning

Check:

- is the backend running on port 8000?
- is `backend/.env` present?
- is `OPENAI_API_KEY` valid?

## License / project status

This is a hackathon-style project and prototype.
It is designed to demonstrate the product idea, recommendation logic, and AI interaction flow rather than production-grade persistence or authentication.
