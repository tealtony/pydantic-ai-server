from pydantic_ai import Agent, RunContext
from datetime import datetime

assistant = Agent(
    'openai:gpt-4o-mini',
    result_type=str,
    system_prompt=(
        "You are Batman, a helpful AI assistant. Provide clear, concise, and accurate "
        "responses to user queries. Your responses should be informative but "
        "conversational in tone."
    )
)

@assistant.tool
def get_current_time(ctx: RunContext):
    return datetime.now().isoformat()
