from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from app.agent import ChatAgent
from pydantic_ai.exceptions import UnexpectedModelBehavior
import json
from datetime import datetime, timezone
from typing import AsyncIterator
from app.models import ChatMessage

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chat_agent = ChatAgent()

def create_chat_message(role: str, content: str) -> dict:
    """Create a chat message in the format expected by the frontend."""
    return {
        'role': role,
        'timestamp': datetime.now(tz=timezone.utc).isoformat(),
        'content': content
    }

@app.post("/chat")
async def chat(chat_message: ChatMessage) -> StreamingResponse:
    """Stream chat responses to the client."""
    # Create new session if none provided
    session_id = chat_message.session_id or chat_agent.create_session()

    async def stream_messages() -> AsyncIterator[bytes]:
        # Send the user message immediately
        user_msg = create_chat_message('user', chat_message.message)
        user_msg['session_id'] = session_id
        yield json.dumps(user_msg).encode('utf-8') + b'\n'

        try:
            # Stream the AI response
            async for text in chat_agent.get_streaming_response(chat_message.message, session_id):
                ai_msg = create_chat_message('model', text)
                ai_msg['session_id'] = session_id
                yield json.dumps(ai_msg).encode('utf-8') + b'\n'
        except UnexpectedModelBehavior as e:
            error_msg = create_chat_message('error', str(e))
            error_msg['session_id'] = session_id
            yield json.dumps(error_msg).encode('utf-8') + b'\n'
        except KeyError:
            error_msg = create_chat_message('error', "Invalid session ID")
            yield json.dumps(error_msg).encode('utf-8') + b'\n'

    return StreamingResponse(
        stream_messages(),
        media_type='text/plain'
    )

@app.post("/clear/{session_id}")
async def clear_history(session_id: str):
    """Clear the chat history for a session."""
    try:
        chat_agent.clear_history(session_id)
        return {"status": "success", "message": "Chat history cleared"}
    except KeyError:
        raise HTTPException(status_code=404, detail="Session not found")

@app.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """Delete a chat session."""
    try:
        chat_agent.delete_session(session_id)
        return {"status": "success", "message": "Session deleted"}
    except KeyError:
        raise HTTPException(status_code=404, detail="Session not found") 