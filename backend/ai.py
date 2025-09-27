
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env file
load_dotenv()

# Client automatically picks up GEMINI_API_KEY
client = genai.Client()

VALID_CATEGORIES = ["all", "food", "water", "shelter", "medical", "other"]
DEFAULT_STATUS = "unclaimed"


def categorize_request(text: str) -> dict:
    """
    Classify a disaster relief request into one of the valid categories.
    Always returns both category and a default status ("unclaimed").
    
    Args:
        text (str): The user request message
    
    Returns:
        dict: { "category": str, "status": str }
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""
        Classify the following disaster relief request into exactly one category.

        Categories:
        - food: meals, groceries, hunger, no food, supplies to eat
        - water: bottled water, drinking water, dehydration, no clean water
        - shelter: housing, place to stay, tent, roof, flood damage, homelessness
        - medical: injury, medicine, hospital, doctor, urgent health need
        - other: anything not listed above
        - all: if the request is too vague and you cannot assign a category

        Request: "{text}"

        Return only the category name in lowercase, nothing else.
        """
    )

    category = response.text.strip().lower()
    if category not in VALID_CATEGORIES:
        category = "other"

    return {
        "category": category,
        "status": DEFAULT_STATUS  # frontend now expects this
    }
