import React from 'react';

export default function PageHeader({ icon: Icon, title, description, actions }) {
  return (
    <div className="page-header-row">
      <div className="page-header-title-group">
        <div className="page-header-icon-box">
          <Icon size={24} />
        </div>
        <div>
          <h1 className="page-title-text">{title}</h1>
          <p className="page-desc-text">{description}</p>
        </div>
      </div>

      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>{actions}</div>}
    </div>
  );
}
