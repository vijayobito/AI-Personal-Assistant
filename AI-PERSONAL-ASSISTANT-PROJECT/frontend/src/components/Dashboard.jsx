import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Bell,
  FileText,
  StickyNote,
  Sparkles,
  RotateCcw,
  Paperclip,
  Mic,
  Wand2,
  Send,
  Plus
} from 'lucide-react';
import { fetchAnalytics, sendMessage as sendChatMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

import WelcomeHero from './dashboard/WelcomeHero';
import ScheduleCard from './dashboard/ScheduleCard';
import CalendarCard from './dashboard/CalendarCard';
import ProductivityCard from './dashboard/ProductivityCard';
import RecentDocumentsCard from './dashboard/RecentDocumentsCard';
import ProFeaturesBanner from './dashboard/ProFeaturesBanner';

export default function Dashboard({ onNavigate, onOpenUpgrade }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    tasks: 0,
    reminders: 0,
    documents: 0,
    notes: 0,
  });

  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user?.name?.split(' ')[0] || 'there'}! I'm Nexus AI. I can help you with tasks, reminders, documents, notes, daily plans, and workspace search.\n\nWhat would you like to do today?`,
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [showQuickModal, setShowQuickModal] = useState(false);

  // Fetch real statistics from backend API
  const loadStats = async () => {
    try {
      const data = await fetchAnalytics();
      setStats({
        tasks: data.pending_tasks ?? 0,
        reminders: data.total_reminders ?? 0,
        documents: data.total_documents ?? 0,
        notes: data.total_notes ?? 0,
      });
    } catch (e) {
      console.error('Failed to load stats', e);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleSendChat = async (textToSend) => {
    const query = textToSend || inputMsg;
    if (!query.trim() || loadingAi) return;

    setInputMsg('');
    setChatMessages((prev) => [...prev, { role: 'user', content: query }]);
    setLoadingAi(true);

    try {
      const data = await sendChatMessage(query);
      setChatMessages((prev) => [...prev, data.ai_message]);
      loadStats(); // refresh counts in case tools created tasks/reminders
    } catch (e) {
      console.error('Chat error', e);
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Encountered an error generating AI response.' },
      ]);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear dashboard AI conversation history?')) {
      setChatMessages([
        {
          role: 'assistant',
          content: `Hello ${user?.name?.split(' ')[0] || 'there'}! I'm Nexus AI. What would you like to work on today?`,
        },
      ]);
    }
  };

  return (
    <div className="viewport-body">
      {/* Center Flexible Dashboard Area */}
      <div className="center-content">
        {/* Welcome Hero Banner */}
        <WelcomeHero
          userName={user?.name?.split(' ')[0] || 'Vijay'}
          onActionClick={(promptText) => {
            if (promptText === 'MORE') {
              setShowQuickModal(true);
            } else {
              handleSendChat(promptText);
            }
          }}
        />

        {/* 4 Statistics Cards */}
        <div className="stats-cards-grid">
          {/* Card 1: Tasks */}
          <div className="stat-card-box" onClick={() => onNavigate('tasks')} style={{ cursor: 'pointer' }}>
            <div className="stat-card-top">
              <span className="stat-card-title">Tasks</span>
              <div className="stat-card-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
                <CheckSquare size={18} />
              </div>
            </div>
            <div className="stat-card-val">{stats.tasks}</div>
            <div className="stat-card-footer">
              <span>Pending Tasks</span>
              <span style={{ color: '#22C55E' }}>Active</span>
            </div>
          </div>

          {/* Card 2: Reminders */}
          <div className="stat-card-box" onClick={() => onNavigate('tasks')} style={{ cursor: 'pointer' }}>
            <div className="stat-card-top">
              <span className="stat-card-title">Reminders</span>
              <div className="stat-card-icon-wrap" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#EC4899' }}>
                <Bell size={18} />
              </div>
            </div>
            <div className="stat-card-val">{stats.reminders}</div>
            <div className="stat-card-footer">
              <span>Upcoming</span>
              <span style={{ color: '#EC4899' }}>Scheduled</span>
            </div>
          </div>

          {/* Card 3: Documents */}
          <div className="stat-card-box" onClick={() => onNavigate('documents')} style={{ cursor: 'pointer' }}>
            <div className="stat-card-top">
              <span className="stat-card-title">Documents</span>
              <div className="stat-card-icon-wrap" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
                <FileText size={18} />
              </div>
            </div>
            <div className="stat-card-val">{stats.documents}</div>
            <div className="stat-card-footer">
              <span>Uploaded Files</span>
              <span style={{ color: '#22C55E' }}>RAG Enabled</span>
            </div>
          </div>

          {/* Card 4: Notes */}
          <div className="stat-card-box" onClick={() => onNavigate('notes')} style={{ cursor: 'pointer' }}>
            <div className="stat-card-top">
              <span className="stat-card-title">Notes</span>
              <div className="stat-card-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
                <StickyNote size={18} />
              </div>
            </div>
            <div className="stat-card-val">{stats.notes}</div>
            <div className="stat-card-footer">
              <span>Saved Notes</span>
              <span style={{ color: '#F59E0B' }}>AI Enhanced</span>
            </div>
          </div>
        </div>

        {/* AI Assistant Chat Section */}
        <div className="chat-section-card">
          <div className="chat-card-header">
            <div className="chat-card-title">
              <Sparkles size={18} color="#C084FC" />
              <span>AI Assistant Workspace</span>
            </div>
            <button
              onClick={handleClearChat}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', padding: '4px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem' }}
            >
              <RotateCcw size={12} />
              <span>Clear Chat</span>
            </button>
          </div>

          <div className="chat-messages-area">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`msg-bubble ${msg.role}`}>
                <div className="msg-avatar-icon">
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="msg-text-bubble" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
              </div>
            ))}
            {loadingAi && (
              <div className="msg-bubble assistant">
                <div className="msg-avatar-icon">🤖</div>
                <div className="msg-text-bubble" style={{ opacity: 0.7 }}>Thinking...</div>
              </div>
            )}
          </div>

          {/* Suggestion Chips */}
          <div className="suggestion-chips-bar">
            <button className="chip-suggestion-btn" onClick={() => handleSendChat('Remind me to study Python tomorrow at 7 PM')}>
              ⏰ Remind me to study Python tomorrow at 7 PM
            </button>
            <button className="chip-suggestion-btn" onClick={() => handleSendChat('Summarize my uploaded PDF document')}>
              📑 Summarize my uploaded PDF document
            </button>
            <button className="chip-suggestion-btn" onClick={() => handleSendChat('Write a study plan for FastAPI authentication')}>
              📝 Write a study plan for FastAPI authentication
            </button>
            <button className="chip-suggestion-btn" onClick={() => handleSendChat('Brainstorm ideas for an AI personal assistant')}>
              💡 Brainstorm ideas for AI personal assistant
            </button>
          </div>

          {/* Composer Input Box */}
          <div className="chat-composer-box">
            <div className="composer-input-row">
              <textarea
                className="composer-textarea"
                rows={1}
                placeholder="Type your message or action here..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat();
                  }
                }}
              />
              <button
                className="btn-send-message"
                onClick={() => handleSendChat()}
                disabled={!inputMsg.trim() || loadingAi}
              >
                <Send size={18} />
              </button>
            </div>

            <div className="composer-action-btns">
              <div className="composer-left-tools">
                <button className="composer-tool-btn" onClick={() => onNavigate('documents')}>
                  <Paperclip size={14} />
                  <span>Attach File</span>
                </button>
                <button className="composer-tool-btn" onClick={() => onNavigate('planner')}>
                  <Wand2 size={14} />
                  <span>Daily Planner</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Features Horizontal Banner */}
        <ProFeaturesBanner onUpgrade={onOpenUpgrade} />
      </div>

      {/* Right Sidebar Widgets Panel (~350px) */}
      <aside className="right-sidebar">
        <ScheduleCard onViewAll={() => onNavigate('tasks')} />
        <CalendarCard onSelectDate={() => onNavigate('planner')} />
        <ProductivityCard />
        <RecentDocumentsCard onViewAll={() => onNavigate('documents')} />
      </aside>

      {/* Quick Action Modal for 'More' */}
      {showQuickModal && (
        <div className="modal-overlay" onClick={() => setShowQuickModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div className="modal-header">
              <h3>Quick Productivity Actions</h3>
              <button className="modal-close-btn" onClick={() => setShowQuickModal(false)}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
              <button onClick={() => { onNavigate('tasks'); setShowQuickModal(false); }} className="action-chip-btn" style={{ padding: '12px', justifyContent: 'center' }}>
                <CheckSquare size={16} color="#3B82F6" /> Create Task
              </button>
              <button onClick={() => { onNavigate('notes'); setShowQuickModal(false); }} className="action-chip-btn" style={{ padding: '12px', justifyContent: 'center' }}>
                <StickyNote size={16} color="#F59E0B" /> Create Note
              </button>
              <button onClick={() => { onNavigate('documents'); setShowQuickModal(false); }} className="action-chip-btn" style={{ padding: '12px', justifyContent: 'center' }}>
                <FileText size={16} color="#06B6D4" /> Upload Doc
              </button>
              <button onClick={() => { onNavigate('planner'); setShowQuickModal(false); }} className="action-chip-btn" style={{ padding: '12px', justifyContent: 'center' }}>
                <Wand2 size={16} color="#A855F7" /> Daily Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
