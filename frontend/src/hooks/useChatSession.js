import { useState, useEffect } from 'react';

export function useChatSession() {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    return () => {
      if (sessionId) {
        fetch(`${process.env.REACT_APP_API_URL}/session/${sessionId}`, {
          method: 'DELETE',
        }).catch(console.error);
      }
    };
  }, [sessionId]);

  return {
    sessionId,
    setSessionId,
  };
} 