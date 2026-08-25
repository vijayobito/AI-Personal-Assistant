import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';

export default function RecentDocumentsCard({ onViewAll }) {
  const [docs, setDocs] = useState([
    { id: '1', filename: 'AI Project Report.pdf', timeAgo: '2h ago' },
    { id: '2', filename: 'Python Notes.pdf', timeAgo: '5h ago' },
    { id: '3', filename: 'Machine Learning Guide.pdf', timeAgo: '1d ago' },
  ]);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/documents');
        if (res.ok) {
          const list = await res.json();
          if (list.length > 0) {
            setDocs(list.slice(0, 3).map(d => ({
              id: d.id,
              filename: d.filename,
              timeAgo: 'Recently'
            })));
          }
        }
      } catch (e) {
        console.error('Fetch docs error', e);
      }
    };
    fetchDocs();
  }, []);

  return (
    <div className="widget-card">
      <div className="widget-card-header">
        <span className="widget-card-title">Recent Documents</span>
        <span className="widget-view-all" onClick={onViewAll}>View All</span>
      </div>

      <div className="recent-docs-list">
        {docs.map((doc) => (
          <div key={doc.id} className="doc-row-item" onClick={onViewAll}>
            <div className="doc-row-left">
              <FileText size={16} color="#EC4899" />
              <span className="doc-name-text">{doc.filename}</span>
            </div>
            <span className="doc-time-ago">{doc.timeAgo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
