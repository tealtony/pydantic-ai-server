from typing import Dict
from .memory_store import MemoryStore
import uuid

class SessionManager:
    def __init__(self):
        self.sessions: Dict[str, MemoryStore] = {}

    def create_session(self) -> str:
        """Create a new chat session and return its ID."""
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = MemoryStore()
        return session_id

    def get_session(self, session_id: str) -> MemoryStore:
        """Get a chat session by ID."""
        if session_id not in self.sessions:
            raise KeyError(f"Session {session_id} not found")
        return self.sessions[session_id]

    def delete_session(self, session_id: str) -> None:
        """Delete a chat session."""
        if session_id in self.sessions:
            del self.sessions[session_id] 