import React from 'react';

function ChatControls({ onClear, disabled }) {
  return (
    <div className="chat-controls">
      <button onClick={onClear} className="clear-button" disabled={disabled}>
        Clear Chat
      </button>
    </div>
  );
}

export default ChatControls; 