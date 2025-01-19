import React, { useRef, useEffect } from 'react';

function ChatInput({ message, setMessage, isLoading, onSubmit }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <form onSubmit={onSubmit}>
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}

export default ChatInput; 