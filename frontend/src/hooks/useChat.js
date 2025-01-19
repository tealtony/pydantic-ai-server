import { useRef, useState } from 'react';
import { useChatHistory } from './useChatHistory';
import { useChatSession } from './useChatSession';
import { handleChatStream } from '../utils/chatStream';

export function useChat() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(null);
  const { sessionId, setSessionId } = useChatSession();
  const { chatHistory, updateHistory, addErrorMessage, clearHistory } = useChatHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      await handleChatStream(message, sessionId, abortController.signal, {
        onFirstMessage: () => {
          setIsLoading(false);
          setMessage('');
        },
        onMessage: (msgData) => {
          if (!sessionId && msgData.session_id) {
            setSessionId(msgData.session_id);
          }
          updateHistory(msgData);
        }
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        addErrorMessage('An error occurred while sending the message.');
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
      clearHistory();
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  return {
    message,
    setMessage,
    isLoading,
    chatHistory,
    sessionId,
    handleSubmit,
    handleClear
  };
} 