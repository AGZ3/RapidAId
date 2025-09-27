# backend/ai.py
import json
import os
import re
from dotenv import load_dotenv
from google.genai import Client

# Load API key from .env
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = Client(api_key=api_key)

MODEL_NAME = "gemini-2.0-flash"

# Base tags per need_type
TAG_MAP = {
    "water": ["water"],
    "food": ["food"],
    "shelter": ["shelter"],
    "medical": ["medical"],
    "other": ["other"]
}

def process_with_ai(message: str):
    prompt = f"""
You are a relief response AI.
Convert the user message below into JSON with exactly these keys:
title, need_type, priority_score, tags, notes.

Rules:
- need_type must be one of ["water","food","shelter","medical","other"]
- priority_score 0-100 (higher = more urgent)
- tags must include the need_type. Include "urgent" only if the message indicates urgency.
- notes is the original message

Message: "{message}"
Return only JSON.
"""

    try:
        # Call Gemini 2.0 Flash
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        text = response.text.strip()

        # Extract JSON in case AI adds extra text
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            data = json.loads(match.group())
        else:
            data = None

        if not data:
            raise ValueError("No valid JSON returned from AI")

        # Ensure all keys exist with defaults
        defaults = {
            "title": message[:30],
            "need_type": "other",
            "priority_score": 50,
            "tags": [],
            "notes": message
        }
        for key in defaults:
            if key not in data:
                data[key] = defaults[key]

        # Normalize need_type and assign base tag
        need_type = data.get("need_type", "other").lower()
        tags = TAG_MAP.get(need_type, ["other"])

        # Determine urgency based on priority_score
        priority = data.get("priority_score", 50)
        if priority >= 70:
            if "urgent" not in tags:
                tags.append("urgent")

        data["tags"] = tags
        print(data)

        return data

    except Exception as e:
        # Final fallback
        return {
            "title": message[:30],
            "need_type": "other",
            "priority_score": 50,
            "tags": ["other", "urgent"],
            "notes": message
        }
