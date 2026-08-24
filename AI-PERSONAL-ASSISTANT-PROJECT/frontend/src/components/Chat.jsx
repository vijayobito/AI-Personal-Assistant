import { useState, useRef, useEffect } from 'react';
import Message from './Message';

const SUGGESTIONS = [
  '💡 Explain quantum computing',
  '📝 Write a short poem',
  '🧠 Help me brainstorm ideas',
  '💻 Debug my code',
];

export default function Chat({
  messages,
  isLoading,
  error,
  messagesEndRef,
  onSend,
  onSuggestion,
  onToggleSidebar,
}) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 150) + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text) => {
    // Strip the emoji prefix
    const clean = text.replace(/^[^\s]+\s/, '');
    onSend(clean);
  };

  const showWelcome = messages.length === 0 && !isLoading;

  return (
    <main className="chat">
      {/* Mobile sidebar toggle */}
      <button className="sidebar__toggle" onClick={onToggleSidebar}>
        ☰
      </button>

      {/* Messages or Welcome */}
      {showWelcome ? (
        <div className="chat__welcome">
          <div className="chat__welcome-icon">✦</div>
          <h2>Hello! How can I help you?</h2>
          <p>
            I'm your AI personal assistant. Ask me anything — from answering
            questions and writing code to brainstorming ideas and creative
            writing.
          </p>
          <div className="chat__suggestions">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                className="chat__suggestion"
                onClick={() => handleSuggestionClick(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="chat__messages">
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="typing-indicator">
              <div className="typing-indicator__avatar">✦</div>
              <div className="typing-indicator__dots">
                <div className="typing-indicator__dot" />
                <div className="typing-indicator__dot" />
                <div className="typing-indicator__dot" />
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="message message--assistant">
              <div className="message__avatar">⚠️</div>
              <div className="message__content" style={{ borderColor: '#f87171' }}>
                {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area */}
      <div className="chat__input-area">
        <div className="chat__input-wrapper">
          <textarea
            ref={textareaRef}
            className="chat__textarea"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
          />
          <button
            className="chat__send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            title="Send message"
          >
            ➤
          </button>
        </div>
        <div className="chat__input-hint">
          Press Enter to send · Shift + Enter for new line
        </div>
      </div>
    </main>
  );
}
