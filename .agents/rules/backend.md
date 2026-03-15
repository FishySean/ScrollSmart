# Backend Implementation Standards

## Framework
FastAPI (Python).

## Storage Constraints
- Data is strictly in-memory using Python dictionaries mapping in `backend/app/models/storage.py`.
- **NO EXTERNAL DATABASE** (SQL/NoSQL) is permitted for this version. Do not introduce database dependencies.

## Weight Update Logic
Topic weights ($w$) must follow these exact delta calculations based on user interaction:
- **Like:** $+0.15$
- **Skip/Dislike:** $-0.10$
- **Go Deeper:** $+0.20$
- **Chat Message:** $+0.05$ (capped at an absolute maximum of $+0.30$ per card)
- **Linger (>30s):** $+0.10$

## Topic Selection
Use the **80/20 rule**:
- 80% exploitation of known high-weight topics.
- 20% exploration of new or low-weight topics to ensure discovery.

## Error Handling & Validation
- Backend routes in `backend/app/api/routes.py` MUST use Pydantic schemas for all input and output validation.
- Return appropriate HTTP exceptions (e.g., `404` for missing users, `400` for invalid registration). 
- Do not let unhandled server errors leak to the client.
