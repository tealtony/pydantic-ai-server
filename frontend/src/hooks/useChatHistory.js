import { useState } from 'react';

export function useChatHistory() {
  const [chatHistory, setChatHistory] = useState([]);

  const updateHistory = (msgData) => {
    setChatHistory(prev => {
      if (msgData.role === 'user') return [...prev, msgData];
      if (prev.length > 0 && prev[prev.length - 1].role === 'model') {
        return [...prev.slice(0, -1), msgData];
      }
      return [...prev, msgData];
    });
  };

  const addErrorMessage = (content) => {
    setChatHistory(prev => [...prev, {
      role: 'error',
      content,
      timestamp: new Date().toISOString()
    }]);
  };

  const clearHistory = () => setChatHistory([]);

  return { chatHistory, updateHistory, addErrorMessage, clearHistory };
} 