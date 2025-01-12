from pydantic import BaseModel

class ChatMessage(BaseModel):
    session_id: str | None = None
    message: str

class ChatResponse(BaseModel):
    response: str
    session_id: str | None = None

    def __str__(self) -> str:
        return self.response 