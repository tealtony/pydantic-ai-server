import React, { useRef, useEffect } from 'react';
import MessageContent from './MessageContent';

function ChatHistory({ messages }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-history">
      {messages.map((msg, index) => (
        <div key={`${msg.timestamp}-${index}`} className={`message ${msg.role}`}>
          <div className="message-header">
            {msg.role === 'user' ? 'You' : 'AI'}
          </div>
          <MessageContent message={msg} />
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
}

export default ChatHistory; 