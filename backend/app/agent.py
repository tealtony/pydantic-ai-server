from typing import AsyncIterator
from .session import SessionManager
from .agents.assistant import assistant

class ChatAgent:
    def __init__(self):
        self.agent = assistant
        self.session_manager = SessionManager()
    
    async def get_streaming_response(
        self, 
        message: str,
        session_id: str,
    ) -> AsyncIterator[str]:
        """Stream the response with message history context."""
        memory = self.session_manager.get_session(session_id)
        
        async with self.agent.run_stream(message, message_history=memory.get_history()) as result:
            response_content = ""
            async for text in result.stream(debounce_by=0.01):
                response_content += text
                yield text
            
            memory.add_messages(result.new_messages())
    
    def create_session(self) -> str:
        """Create a new chat session."""
        return self.session_manager.create_session()
    
    def clear_history(self, session_id: str):
        """Clear the chat history for a session."""
        memory = self.session_manager.get_session(session_id)
        memory.clear()
    
    def delete_session(self, session_id: str):
        """Delete a chat session."""
        self.session_manager.delete_session(session_id) 