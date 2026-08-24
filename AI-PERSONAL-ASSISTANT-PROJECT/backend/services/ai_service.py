"""
AI Service — Google Gemini Integration
Handles communication with the Gemini 2.0 Flash model using the google.genai SDK.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"

SYSTEM_INSTRUCTION = (
    "You are a helpful, friendly, and knowledgeable AI personal assistant. "
    "You provide clear, concise, and accurate answers. "
    "You can help with questions, creative writing, coding, math, planning, "
    "and general knowledge. Be warm and conversational while staying informative. "
    "Use markdown formatting when it helps readability."
)

FALLBACK_RESPONSE = (
    "I'm running without an AI backend right now. To enable AI responses, "
    "add your Gemini API key to `backend/.env`:\n\n"
    "```\nGEMINI_API_KEY=your_key_here\n```\n\n"
    "Get a free key at [Google AI Studio](https://aistudio.google.com/apikey)."
)


def get_gemini_client():
    """
    Dynamically loads the API key from .env so modifications
    are recognized immediately without server restarts.
    """
    if ENV_PATH.exists():
        load_dotenv(dotenv_path=ENV_PATH, override=True)
    else:
        load_dotenv(override=True)

    api_key = os.getenv("GEMINI_API_KEY", "").strip().strip("'\"")
    if api_key and api_key != "your_api_key_here":
        try:
            return genai.Client(api_key=api_key)
        except Exception as e:
            print(f"[ERROR] Failed to initialize Gemini client: {e}")
            return None
    return None


def generate_response(messages: list[dict]) -> str:
    """
    Generate an AI response given conversation history.

    Args:
        messages: List of dicts with 'role' and 'content' keys.
                  Roles are 'user' or 'assistant' (mapped to 'model' for Gemini).

    Returns:
        The AI-generated response text.
    """
    client = get_gemini_client()
    if not client:
        return FALLBACK_RESPONSE

    try:
        # Convert message history to Gemini format
        gemini_contents = []
        for msg in messages:
            role = "model" if msg["role"] == "assistant" else "user"
            gemini_contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=msg["content"])],
                )
            )

        # Generate response using the official google.genai SDK
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=gemini_contents,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                temperature=0.7,
                max_output_tokens=2048,
            ),
        )

        if response and response.text:
            return response.text
        return "I received an empty response from the AI model. Please try asking again."

    except Exception as e:
        error_msg = str(e)
        print(f"[ERROR] Gemini API error: {error_msg}")

        if "API_KEY" in error_msg.upper() or "PERMISSION" in error_msg.upper() or "AUTHENTICATION" in error_msg.upper():
            return (
                "There's an issue with the API key. Please verify that your "
                "`GEMINI_API_KEY` in `backend/.env` is correct and active at "
                "[Google AI Studio](https://aistudio.google.com/apikey)."
            )

        return (
            f"I encountered an error generating a response: {error_msg}. "
            "Please try again in a moment."
        )
