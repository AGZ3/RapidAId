
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env file
load_dotenv()

# Configure Google AI Studio
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)

VALID_CATEGORIES = ["all", "food", "water", "shelter", "medical", "other"]


def categorize_request(text: str) -> str:
    """
    Use Google Vertex AI (Gemini) to classify a disaster relief request
    into one of the valid categories.

    Args:
        text (str): The user request message

    Returns:
        str: One of ["All", "Food", "Water", "Shelter", "Medical", "Other"]
    """

    prompt = f"""
    Classify the following disaster relief request into exactly one category.

    Categories:
    - Food: meals, groceries, hunger, no food, supplies to eat
    - Water: bottled water, drinking water, dehydration, no clean water
    - Shelter: housing, place to stay, tent, roof, flood damage, homelessness
    - Medical: injury, medicine, hospital, doctor, urgent health need
    - Other: anything not listed above
    - All: if the request is too vague and you cannot assign a category

    Request: "{text}"

    Return only the category name, nothing else.
    """

    try:
        response = model.generate_content(prompt)
        category = response.candidates[0].content.parts[0].text.strip().capitalize()

        if category not in ["All", "Food", "Water", "Shelter", "Medical", "Other"]:
            return "Other"

        return category

    except Exception:
        return "Other"
