import React from 'react';

export default function StatCard({ icon: Icon, title, value, subtext, accentColor = '#8B5CF6', onClick }) {
  return (
    <div className="stat-card-box" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="stat-card-top">
        <span className="stat-card-title">{title}</span>
        <div className="stat-card-icon-wrap" style={{ background: `${accentColor}18`, color: accentColor }}>
          <Icon size={18} />
        </div>
      </div>
      <div className="stat-card-val">{value}</div>
      {subtext && (
        <div className="stat-card-footer">
          <span>{subtext}</span>
        </div>
      )}
    </div>
  );
}
