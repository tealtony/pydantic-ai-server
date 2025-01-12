import React, { useState, useEffect, useRef } from 'react';

function Chat() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    
    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          session_id: sessionId
        }),
        signal: abortController.signal,
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let isFirstMessage = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const messages = text.split('\n').filter(line => line.trim());
        
        for (const msgText of messages) {
          try {
            const msgData = JSON.parse(msgText);
            // Enable input and clear message after first message received
            if (isFirstMessage) {
              setIsLoading(false);
              setMessage('');
              isFirstMessage = false;
            }
            // Store session ID from first message
            if (!sessionId && msgData.session_id) {
              setSessionId(msgData.session_id);
            }
            setChatHistory(prev => {
              if (msgData.role === 'user') {
                return [...prev, msgData];
              }
              // For model responses, update the last message if it exists
              if (prev.length > 0 && prev[prev.length - 1].role === 'model') {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = msgData;
                return newHistory;
              }
              // If no model message exists yet, add it
              return [...prev, msgData];
            });
          } catch (e) {
            console.error('Error parsing message:', e);
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Error:', error);
        setChatHistory(prev => [...prev, {
          role: 'error',
          content: 'An error occurred while sending the message.',
          timestamp: new Date().toISOString()
        }]);
      }
      setIsLoading(false);
      setMessage('');
    }
  };

  const handleClear = async () => {
    if (!sessionId) return;

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/clear/${sessionId}`, {
        method: 'POST',
      });
      setChatHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  // Optional: Clean up session on component unmount
  useEffect(() => {
    return () => {
      if (sessionId) {
        fetch(`${process.env.REACT_APP_API_URL}/session/${sessionId}`, {
          method: 'DELETE',
        }).catch(console.error);
      }
    };
  }, [sessionId]);

  return (
    <div className="chat-container">
      <div className="chat-controls">
        <button onClick={handleClear} className="clear-button" disabled={!sessionId}>
          Clear Chat
        </button>
      </div>
      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div key={`${msg.timestamp}-${index}`} className={`message ${msg.role}`}>
            <div className="message-header">
              {msg.role === 'user' ? 'You' : 'AI'}
            </div>
            <div className="message-content">
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit}>
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
    </div>
  );
}

export default Chat; 