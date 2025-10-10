@app.post("/chat", response_model=ChatResponse)
def chat_with_model(request: ChatRequest):
    session_id = request.session_id or str(uuid.uuid4())

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

    # ✅ No overwrite here — use model's response directly
    return ChatResponse(session_id=session_id, response=markdown_response)
