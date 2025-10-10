from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI(title="Dummy Model API")

# ---------------- Schema ----------------
class ModelRequest(BaseModel):
    session_id: str
    user_query: str

class ModelResponse(BaseModel):
    markdown_response: str

# ---------------- Markdown Samples ----------------
simple_markdowns = [
    "## Test  Report\n\n- Test-204: 38 hrs\n- Test ",
    "## Production Summary\n\n- Unit 1: +12%\n- Unit 2: -8%",
    "## Test Insights\n\nPending: 19\nCompleted: 105",
]

# ---------------- Dashboard Markdown ----------------
dashboard_markdown = """
# 🚀 Test Dashboard

## Production Overview
**Unit 1:** 1200 units  
**Unit 2:** 950 units  

![Production Chart](https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg)

## Downtime Table
| Equipment | Downtime (hrs) | Status |
|-----------|----------------|--------|
| Test-204 | 38 | ⚠️ |
| Test y-101 | 27 | ⚠️ |
| Test Test-305 | 14 | ✅ |

## Maintenance Grid
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
  <div style="background:#f0f0f0; padding:10px;">Task 1</div>
  <div style="background:#f0f0f0; padding:10px;">Task 2</div>
  <div style="background:#f0f0f0; padding:10px;">Task 3</div>
</div>

## Images
![Machine](https://upload.wikimedia.org/wikipedia/commons/6/65/Generic_machine_image.svg)
![Sensor](https://upload.wikimedia.org/wikipedia/commons/1/17/Placeholder_image.svg)
"""

# ---------------- Endpoint ----------------
@app.post("/chat", response_model=ModelResponse)
def chat_model(request: ModelRequest):
    """
    - Returns random markdown for normal queries
    - Returns dashboard markdown if 'dashboard' keyword is present
    """
    user_query_lower = request.user_query.lower()

    if "dashboard" in user_query_lower or "visualize" in user_query_lower:
        return ModelResponse(markdown_response=dashboard_markdown)

    # Otherwise, return a random markdown
    response = random.choice(simple_markdowns)
    return ModelResponse(markdown_response=response)



=========


import re

def is_markdown_regex(s: str) -> bool:
    patterns = [
        r"^#{1,6}\s",       # headings
        r"^- ",             # list item
        r"\*\*.*\*\*",      # bold
        r"_.*_",            # italic
        r"!\[.*\]\(.*\)",   # image
        r"\|.*\|",          # table
        r"```.*```",        # code block
    ]
    return any(re.search(p, s, re.MULTILINE) for p in patterns)



===================


def is_markdown(s: str) -> bool:
    markdown_indicators = [
        "#",       # heading
        "##",      # subheading
        "- ",      # unordered list
        "* ",      # unordered list
        "```",     # code block
        "|",       # table
        "![",      # image
        "[",       # link
        "**",      # bold
        "_",       # italic
    ]
    return any(token in s for token in markdown_indicators)


if is_markdown(random_response):
    # Treat as markdown → generate dashboard
    response = dashboard_markdown
else:
    # Normal text
    response = random_response
