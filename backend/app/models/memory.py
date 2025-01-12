from typing import List
from pydantic import BaseModel, Field
from pydantic_ai.messages import ModelMessage

class ChatMemory(BaseModel):
    messages: List[ModelMessage] = Field(default_factory=list)