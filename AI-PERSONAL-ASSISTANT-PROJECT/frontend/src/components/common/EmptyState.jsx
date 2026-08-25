import React from 'react';

export default function EmptyState({ icon: Icon, title, description, actionText, onAction }) {
  return (
    <div className="empty-state-box">
      <div className="empty-state-icon-glow">
        <Icon size={30} />
      </div>
      <div className="empty-state-title">{title}</div>
      <div className="empty-state-desc">{description}</div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          style={{
            background: 'var(--gradient-button)',
            color: 'white',
            border: 'none',
            padding: '10px 22px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            marginTop: '8px',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
