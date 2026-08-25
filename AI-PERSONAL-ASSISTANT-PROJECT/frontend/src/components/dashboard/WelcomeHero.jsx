import React from 'react';
import { FileText, Bell, Edit3, Lightbulb, MoreHorizontal } from 'lucide-react';

export default function WelcomeHero({ userName, onActionClick }) {
  return (
    <div className="hero-card">
      <div className="hero-left-content">
        <h1 className="hero-greeting">
          Good Day, <span className="hero-greeting-name">{userName || 'Vijay'}!</span> 👋
        </h1>
        <p className="hero-subtitle">
          How can I help you be more productive today?
        </p>

        {/* Quick Action Chips */}
        <div className="hero-action-chips">
          <button className="action-chip-btn" onClick={() => onActionClick('Summarize my uploaded PDF document')}>
            <FileText size={15} color="#3B82F6" />
            <span>Summarize PDF</span>
          </button>

          <button className="action-chip-btn" onClick={() => onActionClick('Remind me to study Python tomorrow at 7 PM')}>
            <Bell size={15} color="#EC4899" />
            <span>Create Reminder</span>
          </button>

          <button className="action-chip-btn" onClick={() => onActionClick('Save a note about FastAPI authentication')}>
            <Edit3 size={15} color="#F59E0B" />
            <span>Write Notes</span>
          </button>

          <button className="action-chip-btn" onClick={() => onActionClick('Brainstorm ideas for an AI personal assistant')}>
            <Lightbulb size={15} color="#8B5CF6" />
            <span>Brainstorm Ideas</span>
          </button>

          <button className="action-chip-btn" onClick={() => onActionClick('MORE')} style={{ padding: '8px 12px' }}>
            <MoreHorizontal size={16} color="#94A3B8" />
            <span>More</span>
          </button>
        </div>
      </div>

      {/* Futuristic 3D CSS AI Assistant Orb Visual */}
      <div className="hero-ai-orb-container">
        <div className="ai-orb-outer-glow"></div>
        <div className="ai-orb-core">
          <div className="ai-orb-eyes">
            <div className="ai-orb-eye"></div>
            <div className="ai-orb-eye"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
