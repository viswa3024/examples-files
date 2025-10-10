from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uuid
import requests
import re

app = FastAPI(title="Chat API with Markdown Detection")

# ================= Schemas =================
class ChatRequest(BaseModel):
    session_id: str | None = None
    message: str

class ChatResponse(BaseModel):
    session_id: str
    response: str

# ================= Model API =================
MODEL_API_URL = "http://localhost:8001/chat"  # Replace with your actual model API

# ================= Dashboard Markdown =================
DASHBOARD_MARKDOWN = """


## Images
![Machine](https://upload.wikimedia.org/wikipedia/commons/6/65/Generic_machine_image.svg)
![Sensor](https://upload.wikimedia.org/wikipedia/commons/1/17/Placeholder_image.svg)
"""

# ================= Helper =================
def is_markdown(s: str) -> bool:
    """Detect if string contains typical markdown syntax"""
    markdown_tokens = ["#", "##", "- ", "* ", "```", "|", "![", "[", "**", "_"]
    return any(token in s for token in markdown_tokens)

# ================= Endpoint =================
@app.post("/chat", response_model=ChatResponse)
def chat_with_model(request: ChatRequest):
    # 1️⃣ Generate session_id if first-time
    session_id = request.session_id or str(uuid.uuid4())

    # 2️⃣ Call external model API via requests
    try:
        resp = requests.post(
            MODEL_API_URL,
            json={"session_id": session_id, "user_query": request.message},
            timeout=60
        )
        resp.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Model API call failed: {str(e)}")

    model_data = resp.json()
    markdown_response = model_data.get("markdown_response", "⚠️ No response from model API")

    # 3️⃣ Check if model response is markdown → replace with dashboard if needed
    if is_markdown(markdown_response):
        markdown_response = DASHBOARD_MARKDOWN

    # 4️⃣ Return session_id + model response
    return ChatResponse(session_id=session_id, response=markdown_response)
