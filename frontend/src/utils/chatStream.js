export async function handleChatStream(message, sessionId, signal, callbacks) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      message,
      session_id: sessionId
    }),
    signal,
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
        if (isFirstMessage) {
          callbacks.onFirstMessage();
          isFirstMessage = false;
        }
        callbacks.onMessage(msgData);
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    }
  }
} 