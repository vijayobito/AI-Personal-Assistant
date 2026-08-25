"""
AI Service — Gemini 2.0 Integration & Tool Calling Architecture
Handles AI generation, embedding creation, vector similarity, and structured function calling (tools).
"""

import os
import json
import math
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"

SYSTEM_INSTRUCTION = (
    "You are a helpful, smart, and proactive AI personal assistant and productivity manager. "
    "You possess full tool-calling capabilities to manage the user's tasks, reminders, AI memories, "
    "notes, daily schedule planner, and document workspace (PDF, DOCX, TXT, CSV).\n\n"
    "Tool Usage Rules:\n"
    "1. **Memory**: If the user tells you personal details, preferences, or important facts (e.g. 'My name is Vijay', 'I prefer dark mode'), call `remember_user_fact`.\n"
    "2. **Tasks & Reminders**: For creating tasks/reminders with priority (High/Medium/Low) or recurrence (daily/weekly/one-time), call `create_task` or `create_reminder`.\n"
    "3. **Notes**: For saving notes, call `create_note`. For reading notes, call `get_notes`.\n"
    "4. **Planner**: For daily schedule generation, call `generate_daily_plan`.\n"
    "5. **Universal Search**: For finding information across the user's entire workspace, call `search_all`.\n"
    "6. **Documents**: For querying uploaded files, call `search_documents` or `summarize_document`.\n"
    "Be warm, clear, encouraging, structured, and use Markdown formatting."
)

FALLBACK_RESPONSE = (
    "I'm running without a configured AI API key. To enable full AI functionality and tools, "
    "add your Gemini API key to `backend/.env`:\n\n"
    "```\nGEMINI_API_KEY=your_key_here\n```\n\n"
    "Get a key at [Google AI Studio](https://aistudio.google.com/apikey)."
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


def generate_embedding(text: str) -> list[float]:
    """
    Generate vector embedding using Gemini API text-embedding-004 or local fallback.
    """
    client = get_gemini_client()
    if client:
        try:
            res = client.models.embed_content(
                model="text-embedding-004",
                contents=text,
            )
            if res and res.embedding and res.embedding.values:
                return list(res.embedding.values)
        except Exception as e:
            print(f"[WARNING] Gemini embedding failed, using local hash fallback: {e}")

    # Deterministic fallback vector embedding if offline or no key
    vec = [0.0] * 64
    for i, char in enumerate(text):
        vec[i % 64] += ord(char) % 10 / 10.0
    norm = math.sqrt(sum(x * x for x in vec)) or 1.0
    return [x / norm for x in vec]


def cosine_similarity(vec1: list[float], vec2: list[float]) -> float:
    """Calculate cosine similarity between two float vectors."""
    if not vec1 or not vec2 or len(vec1) != len(vec2):
        # Handle fallback dimension mismatch gracefully
        min_len = min(len(vec1), len(vec2))
        vec1 = vec1[:min_len]
        vec2 = vec2[:min_len]

    dot = sum(a * b for a, b in zip(vec1, vec2))
    norm1 = math.sqrt(sum(a * a for a in vec1))
    norm2 = math.sqrt(sum(b * b for b in vec2))
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return dot / (norm1 * norm2)


# ──────────────────────────────────────────────
# Gemini Function Tool Definitions
# ──────────────────────────────────────────────

TOOL_DEFINITIONS = [
    {
        "name": "remember_user_fact",
        "description": "Remembers an important fact, personal preference, or detail specified by the user.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "fact": {"type": "STRING", "description": "The fact or preference to remember (e.g. 'User name is Vijay')."},
                "category": {"type": "STRING", "description": "Optional category (e.g. 'personal', 'preference', 'work')."}
            },
            "required": ["fact"]
        }
    },
    {
        "name": "create_task",
        "description": "Creates a task with title, priority (High/Medium/Low), due date, due time, and optional recurrence (daily/weekly/none).",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "title": {"type": "STRING", "description": "Title of the task."},
                "priority": {"type": "STRING", "description": "Task priority: 'High', 'Medium', or 'Low'."},
                "due_date": {"type": "STRING", "description": "Due date (e.g. '2026-08-25', 'Today', 'Tomorrow')."},
                "due_time": {"type": "STRING", "description": "Due time (e.g. '7:00 PM')."},
                "recurrence": {"type": "STRING", "description": "Recurrence pattern: 'none', 'daily', 'weekly'."}
            },
            "required": ["title"]
        }
    },
    {
        "name": "create_reminder",
        "description": "Saves a reminder task for the user with task title, target date, and target time.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "task": {"type": "STRING", "description": "The activity or item to be reminded of (e.g., 'Study Python')."},
                "date": {"type": "STRING", "description": "The date for the reminder (e.g., '2026-08-25', 'Tomorrow', 'Today')."},
                "time": {"type": "STRING", "description": "The time for the reminder (e.g., '7:00 PM', '19:00')."},
            },
            "required": ["task", "date", "time"],
        },
    },
    {
        "name": "get_reminders",
        "description": "Retrieves saved upcoming reminders from the database.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "filter_date": {"type": "STRING", "description": "Optional date filter (e.g. 'tomorrow', 'today', or 'all')."},
            },
        },
    },
    {
        "name": "delete_reminder",
        "description": "Deletes a reminder from the database by ID or task title search.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "reminder_id": {"type": "STRING", "description": "The unique ID of the reminder to delete."},
                "task_search": {"type": "STRING", "description": "The task title search term to delete if ID is unknown."},
            },
        },
    },
    {
        "name": "create_note",
        "description": "Saves a note for the user with title, content, and optional tags.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "title": {"type": "STRING", "description": "Title of the note."},
                "content": {"type": "STRING", "description": "Body content of the note."},
                "tags": {"type": "STRING", "description": "Comma-separated tags (e.g. 'fastapi, auth')."}
            },
            "required": ["title", "content"]
        }
    },
    {
        "name": "get_notes",
        "description": "Retrieves notes saved by the user.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "query": {"type": "STRING", "description": "Optional search term to filter notes."}
            }
        }
    },
    {
        "name": "generate_daily_plan",
        "description": "Generates a structured daily time-blocked schedule based on user activities and tasks.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "activities": {
                    "type": "ARRAY",
                    "items": {"type": "STRING"},
                    "description": "List of activities/goals for the day."
                }
            },
            "required": ["activities"]
        }
    },
    {
        "name": "search_all",
        "description": "Universal search across tasks, notes, documents, memory, and chat history.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "query": {"type": "STRING", "description": "Search term."}
            },
            "required": ["query"]
        }
    },
    {
        "name": "search_documents",
        "description": "Searches uploaded document chunks (PDF, DOCX, TXT, CSV) using semantic similarity.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "query": {"type": "STRING", "description": "The search question or query term for the document."},
            },
            "required": ["query"],
        },
    },
    {
        "name": "summarize_document",
        "description": "Summarizes an uploaded document (PDF, DOCX, TXT, CSV).",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "document_id": {"type": "STRING", "description": "Optional document ID to summarize. If omitted, summarizes the latest document."},
            },
        },
    },
]



def generate_response_with_tools(messages: list[dict], tool_executor_func=None) -> str:
    """
    Generate an AI response, supporting multi-turn tool execution calls.
    tool_executor_func: function(tool_name: str, tool_args: dict) -> dict/str
    """
    client = get_gemini_client()
    if not client:
        # Simple heuristic fallback tool trigger when offline/no key
        last_user_msg = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
        if tool_executor_func and ("remind" in last_user_msg.lower() or "reminder" in last_user_msg.lower()):
            # Fallback offline reminder creation
            import re
            m = re.search(r"remind me to (.+?) (tomorrow|today|\d{4}-\d{2}-\d{2})? (at \d{1,2}(?::\d{2})?\s*(?:am|pm)?)?", last_user_msg, re.IGNORECASE)
            task = "Study Python"
            date = "Tomorrow"
            time_str = "7:00 PM"
            if m:
                if m.group(1): task = m.group(1).strip()
                if m.group(2): date = m.group(2).strip()
                if m.group(3): time_str = m.group(3).replace("at", "").strip()
            
            res = tool_executor_func("create_reminder", {"task": task, "date": date, "time": time_str})
            return f"🔊 Okay! I have added your reminder:\n- **Task**: {task}\n- **Date**: {date}\n- **Time**: {time_str}"
        elif tool_executor_func and ("pdf" in last_user_msg.lower() or "document" in last_user_msg.lower() or "summarize" in last_user_msg.lower()):
            if "summarize" in last_user_msg.lower():
                res = tool_executor_func("summarize_document", {})
                return f"📄 **Document Summary**:\n{res.get('summary', 'No uploaded PDF document found.')}"
            else:
                res = tool_executor_func("search_documents", {"query": last_user_msg})
                return f"📄 **Document Results**:\n{res.get('results', 'No matching content found in uploaded documents.')}"

        return FALLBACK_RESPONSE

    try:
        gemini_contents = []
        for msg in messages:
            role = "model" if msg["role"] == "assistant" else "user"
            gemini_contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=msg["content"])],
                )
            )

        # Configure tools using types.Tool
        tools = [types.Tool(function_declarations=TOOL_DEFINITIONS)]
        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            temperature=0.7,
            tools=tools,
        )

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=gemini_contents,
            config=config,
        )

        # Check if the model requested function calling tools
        if response.function_calls:
            for call in response.function_calls:
                name = call.name
                args = call.args or {}
                print(f"[TOOL EXECUTION] Model invoked tool: {name} with args {args}")

                tool_result = {}
                if tool_executor_func:
                    tool_result = tool_executor_func(name, args)

                # Feed function response back to Gemini for final response synthesis
                function_response_content = types.Content(
                    parts=[
                        types.Part.from_function_response(
                            name=name,
                            response={"result": tool_result},
                        )
                    ]
                )
                
                # Append original model call response and function response
                if response.candidates and response.candidates[0].content:
                    gemini_contents.append(response.candidates[0].content)
                gemini_contents.append(function_response_content)

                # Follow-up generation after function execution
                followup_response = client.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=gemini_contents,
                    config=config,
                )
                if followup_response and followup_response.text:
                    return followup_response.text

        if response and response.text:
            return response.text

        return "I received your message and processed all necessary actions."

    except Exception as e:
        error_msg = str(e)
        print(f"[ERROR] Gemini API error: {error_msg}")
        return f"I encountered an error processing your request: {error_msg}"
