import React from 'react';

export default function ToggleSwitch({ active, onChange, label }) {
  return (
    <div className="toggle-switch-container" onClick={() => onChange(!active)}>
      {label && <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>{label}</span>}
      <div className={`toggle-switch-track ${active ? 'active' : ''}`}>
        <div className="toggle-switch-thumb" />
      </div>
    </div>
  );
}
