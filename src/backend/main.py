# backend/main.py
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from datetime import datetime
from ai import process_with_ai  # AI processing function

app = FastAPI()

# Allow frontend access (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (replace with DB in production)
requests_db = []
request_id_counter = 1

@app.post("/api/requests")
async def create_request(
    name: Optional[str] = Form(None),
    address: str = Form(...),
    request_text: str = Form(...)
):
    """
    Accept a request from the frontend, process with AI, and return structured JSON.
    """
    global request_id_counter

    # Process the request with AI
    ai_result = process_with_ai(request_text)

    # Build the structured request object
    request_data = {
        "id": request_id_counter,
        "name": name.strip() if name else "Anonymous",
        "address": address.strip(),
        "request_text": request_text.strip(),
        "category": ai_result.get("need_type", "other"),
        "tags": ai_result.get("tags", []),
        "priority_score": ai_result.get("priority_score", 50),
        "created_at": datetime.utcnow().isoformat() + "Z"
    }

    # Store in memory
    requests_db.append(request_data)
    request_id_counter += 1

    return request_data

@app.get("/api/requests")
async def get_requests():
    """Return all submitted requests"""
    return requests_db

@app.get("/")
async def root():
    return {"message": "Rapid Aid Matcher Backend is running."}
