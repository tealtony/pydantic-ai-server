import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MessageContent({ message }) {
  if (message.role === 'user') {
    return <div className="message-content">{message.content}</div>;
  }

  return (
    <div className="message-content">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ node, ...props }) => (
            <div className="code-block-wrapper">
              <pre {...props} />
            </div>
          ),
          code: ({ node, inline, ...props }) => (
            inline ? (
              <code className="inline-code" {...props} />
            ) : (
              <code className="code-block" {...props} />
            )
          )
        }}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  );
}

export default MessageContent; 