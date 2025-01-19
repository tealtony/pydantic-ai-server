import React from 'react';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import ChatControls from './ChatControls';
import { useChat } from '../hooks/useChat';

function Chat() {
  const {
    message,
    setMessage,
    isLoading,
    chatHistory,
    sessionId,
    handleSubmit,
    handleClear
  } = useChat();

  return (
    <div className="chat-container">
      <ChatControls onClear={handleClear} disabled={!sessionId} />
      <ChatHistory messages={chatHistory} />
      <ChatInput
        message={message}
        setMessage={setMessage}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Chat; 