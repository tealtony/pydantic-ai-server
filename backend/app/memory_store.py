from typing import List
from pydantic_ai.messages import ModelMessage
from .utils.logger import logger

class MemoryStore():
    def __init__(self):
        self.messages: List[ModelMessage] = []
        self.max_recent_messages: int = 10  # Number of most recent messages to keep in full

    def add_messages(self, messages: List[ModelMessage]) -> None:
        """Add a list of messages to memory."""
        self.messages.extend(messages)

    def get_history(self) -> List[ModelMessage]:
        return self._get_abridged_messages()

    def clear(self) -> None:
        """Clear all messages from memory."""
        self.messages = []

    def get_full_history(self) -> List[ModelMessage]:
        """Get the complete message history (for debugging or export)."""
        return self.messages

    def _get_abridged_messages(self) -> List[ModelMessage]:
        """Get the abridged message history."""
        abridged_messages = self.messages[-self.max_recent_messages:]

        # If the first message is a tool response, remove it
        if len(abridged_messages) > 1:
            if abridged_messages[0].parts[0].part_kind == 'tool-return':
                abridged_messages = abridged_messages[1:]

        # This is to ensure that the first message is always the system prompt
        if len(abridged_messages) > 0:
            abridged_messages.insert(0, self.messages[0])
        
        return abridged_messages

