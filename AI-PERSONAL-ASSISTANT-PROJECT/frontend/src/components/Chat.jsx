import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Sparkles, Send, Paperclip, Mic, Wand2, RotateCcw } from 'lucide-react';
import Message from './Message';
import { VoiceControls } from './VoiceControls';
import PageHeader from './common/PageHeader';
import { uploadDocument } from '../services/api';

const SUGGESTIONS = [
  '⏰ Remind me to study Python tomorrow at 7 PM',
  '📄 Summarize my uploaded PDF document',
  '📝 Write a study plan for FastAPI authentication',
  '🧠 Brainstorm ideas for AI personal assistant',
];

export default function Chat({
  messages,
  isLoading,
  error,
  messagesEndRef,
  onSend,
  onToggleSidebar,
}) {
  const [input, setInput] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [showToolsModal, setShowToolsModal] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 150) + 'px';
    }
  }, [input]);

  const handleSend = (textToSend) => {
    const target = textToSend || input;
    if (!target.trim() || isLoading) return;
    onSend(target.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleSendWithAttachment = async () => {
    if (attachedFile) {
      try {
        const doc = await uploadDocument(attachedFile);
        const textPrompt = input.trim() ? `${input.trim()} (Attached file: ${doc.filename})` : `Please analyze and summarize the attached document: ${doc.filename}`;
        setAttachedFile(null);
        handleSend(textPrompt);
      } catch (err) {
        console.error('Failed to attach document:', err);
        handleSend(input);
      }
    } else {
      handleSend();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendWithAttachment();
    }
  };

  const handleSuggestionClick = (text) => {
    // Pass the full suggestion text directly — keep emoji for context clarity
    onSend(text);
  };

  const showWelcome = messages.length === 0 && !isLoading;
  const lastAiMessage =
    messages.length > 0 && messages[messages.length - 1].role === 'assistant'
      ? messages[messages.length - 1].content
      : '';

  return (
    <div className="page-container">
      {/* Page Header */}
      <PageHeader
        icon={MessageSquare}
        title="AI Assistant Chat Workspace"
        description="Conversational AI powered by Gemini 3.6 Flash Low with integrated task creation, RAG document search, and memory recall."
      />

      {/* Main Chat Section Card */}
      <div className="chat-section-card" style={{ flex: 1, minHeight: '520px' }}>
        <div className="chat-card-header">
          <div className="chat-card-title">
            <Sparkles size={18} color="#C084FC" />
            <span>Nexus AI Agent</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>✦ Gemini 3.6 Flash Low (Fast)</span>
          </div>
        </div>

        {showWelcome && !isLoading ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', margin: 'auto' }}>
            <div className="empty-state-icon-glow">
              <Sparkles size={32} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Hello! How can I help you today?</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', fontSize: '0.92rem', lineHeight: 1.5 }}>
              I'm Nexus AI. I can manage your tasks, create reminders, answer questions from your uploaded documents, and remember key facts.
            </p>

            <div className="suggestion-chips-bar" style={{ justifyContent: 'center', marginTop: '12px' }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="chip-suggestion-btn" onClick={() => handleSuggestionClick(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-messages-area" style={{ flex: 1, maxHeight: 'none' }}>
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}

            {isLoading && (
              <div className="msg-bubble assistant">
                <div className="msg-avatar-icon">🤖</div>
                <div className="msg-text-bubble" style={{ opacity: 0.7 }}>Thinking & reasoning...</div>
              </div>
            )}

            {error && (
              <div className="msg-bubble assistant">
                <div className="msg-avatar-icon" style={{ background: '#F87171' }}>⚠️</div>
                <div className="msg-text-bubble" style={{ border: '1px solid #F87171', color: '#F87171' }}>{error}</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Composer Area */}
        <div className="chat-composer-box">
          <VoiceControls onSpeechInput={(transcript) => handleSend(transcript)} activeAiText={lastAiMessage} />

          {attachedFile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.4)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#38bdf8', alignSelf: 'flex-start' }}>
              <Paperclip size={12} />
              <span>{attachedFile.name}</span>
              <button type="button" onClick={() => setAttachedFile(null)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.9rem', marginLeft: '4px' }}>✕</button>
            </div>
          )}

          <div className="composer-input-row">
            <textarea
              ref={textareaRef}
              className="composer-textarea"
              rows={1}
              placeholder={attachedFile ? `Ask something about ${attachedFile.name}...` : "Type your message or click 🎤 Speak..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              className="btn-send-message"
              onClick={handleSendWithAttachment}
              disabled={(!input.trim() && !attachedFile) || isLoading}
            >
              <Send size={18} />
            </button>
          </div>

          <div className="composer-action-btns">
            <div className="composer-left-tools">
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.docx,.txt,.csv"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setAttachedFile(e.target.files[0]);
                  }
                }}
              />
              <button type="button" className="composer-tool-btn" onClick={() => fileInputRef.current?.click()}>
                <Paperclip size={14} />
                <span>{attachedFile ? 'Change File' : 'Attach'}</span>
              </button>
              <button type="button" className="composer-tool-btn" onClick={() => setShowToolsModal(true)}>
                <Wand2 size={14} />
                <span>AI Tools</span>
              </button>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Press Enter to send · Shift + Enter for new line
            </span>
          </div>
        </div>

        {showToolsModal && (
          <div className="modal-overlay" onClick={() => setShowToolsModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
              <div className="modal-header">
                <h3>⚡ Nexus AI Autonomous Tools</h3>
                <button className="modal-close-btn" onClick={() => setShowToolsModal(false)}>✕</button>
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '8px 0 16px' }}>
                Nexus AI can autonomously execute these workspace tools when you chat:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '8px 12px', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155', fontSize: '13px', color: '#f8fafc' }}>
                  ⏰ <strong>create_task / create_reminder</strong>: e.g. "Remind me to study tomorrow at 7 PM"
                </div>
                <div style={{ padding: '8px 12px', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155', fontSize: '13px', color: '#f8fafc' }}>
                  📄 <strong>search_documents / summarize</strong>: e.g. "Summarize my uploaded PDF"
                </div>
                <div style={{ padding: '8px 12px', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155', fontSize: '13px', color: '#f8fafc' }}>
                  🧠 <strong>remember_user_fact</strong>: e.g. "Remember that I am learning React"
                </div>
                <div style={{ padding: '8px 12px', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155', fontSize: '13px', color: '#f8fafc' }}>
                  📅 <strong>generate_daily_plan</strong>: e.g. "Create a daily schedule for study and workout"
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
