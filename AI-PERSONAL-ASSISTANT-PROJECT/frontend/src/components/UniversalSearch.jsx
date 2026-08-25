import React, { useState } from 'react';
import { Search, FileText, CheckSquare, Bell, StickyNote, Brain, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { executeUniversalSearch } from '../services/api';

import PageHeader from './common/PageHeader';
import EmptyState from './common/EmptyState';
import ToggleSwitch from './common/ToggleSwitch';

export default function UniversalSearch({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [aiSearchEnabled, setAiSearchEnabled] = useState(true);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const suggestedSearches = ['Python project', 'FastAPI auth', 'Study reminders', 'AI memories', 'Uploaded docs'];

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);

    try {
      const data = await executeUniversalSearch(query, aiSearchEnabled);
      setResults(data.results);
    } catch (e) {
      console.error('Search error', e);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = async (term) => {
    setQuery(term);
    setLoading(true);
    try {
      const data = await executeUniversalSearch(term, aiSearchEnabled);
      setResults(data.results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <PageHeader
        icon={Search}
        title="Universal Search Workspace"
        description="Search across tasks, reminders, notes, documents, memories, and conversations in one place."
      />

      {/* Prominent Search Card */}
      <div className="section-card">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-input)', border: '1px solid var(--border-active)', padding: '12px 20px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-glow)' }}>
            <Search size={20} color="#C084FC" />
            <input
              type="text"
              placeholder="Search anything across your workspace... (e.g. Python, FastAPI, Vijay)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '1rem', outline: 'none' }}
            />
            <span className="shortcut-badge">Ctrl K</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ background: 'var(--gradient-button)', border: 'none', color: 'white', padding: '0 28px', height: '48px', borderRadius: 'var(--radius-lg)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Filter Chips & AI Search Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '10px' }}>
          <div className="filter-chips-row">
            {['All', 'Tasks', 'Reminders', 'Notes', 'Documents', 'Memories', 'Chats'].map((cat) => (
              <button
                key={cat}
                className={`chip-item-btn ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <ToggleSwitch active={aiSearchEnabled} onChange={setAiSearchEnabled} label="AI Semantic Search" />
        </div>

        {/* Suggested Searches */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: '4px' }}>
          <Sparkles size={14} color="#C084FC" />
          <span>Suggested:</span>
          {suggestedSearches.map((s, idx) => (
            <span
              key={idx}
              onClick={() => handleChipClick(s)}
              style={{ color: 'var(--text-main)', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Results View */}
      {!results && !query ? (
        <EmptyState
          icon={Search}
          title="Search your entire Nexus AI workspace"
          description="Find tasks, documents, notes, memories, and conversations in one place."
          actionText="Try Searching 'Python Project'"
          onAction={() => handleChipClick('Python')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Documents Section */}
          {(activeFilter === 'All' || activeFilter === 'Documents') && results?.documents?.length > 0 && (
            <div className="section-card">
              <div className="section-card-title">
                <FileText size={18} color="#06B6D4" />
                <span>Documents ({results.documents.length})</span>
              </div>
              <div className="card-grid-3col">
                {results.documents.map((d) => (
                  <div key={d.id} className="stat-card-box" onClick={() => onNavigate('documents')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={20} color="#06B6D4" />
                      <span style={{ fontWeight: 600, color: 'white' }}>{d.filename}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', fontSize: '0.8rem', color: 'var(--accent-purple)' }}>
                      <span>Open Workspace</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Section */}
          {(activeFilter === 'All' || activeFilter === 'Tasks') && results?.tasks?.length > 0 && (
            <div className="section-card">
              <div className="section-card-title">
                <CheckSquare size={18} color="#3B82F6" />
                <span>Tasks ({results.tasks.length})</span>
              </div>
              <div className="card-grid-3col">
                {results.tasks.map((t) => (
                  <div key={t.id} className="stat-card-box" onClick={() => onNavigate('tasks')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, color: 'white' }}>{t.title}</span>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', padding: '2px 8px', borderRadius: '10px' }}>
                        {t.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes Section */}
          {(activeFilter === 'All' || activeFilter === 'Notes') && results?.notes?.length > 0 && (
            <div className="section-card">
              <div className="section-card-title">
                <StickyNote size={18} color="#F59E0B" />
                <span>Notes ({results.notes.length})</span>
              </div>
              <div className="card-grid-3col">
                {results.notes.map((n) => (
                  <div key={n.id} className="stat-card-box" onClick={() => onNavigate('notes')} style={{ cursor: 'pointer' }}>
                    <span style={{ fontWeight: 600, color: 'white' }}>{n.title}</span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Memories Section */}
          {(activeFilter === 'All' || activeFilter === 'Memories') && results?.memories?.length > 0 && (
            <div className="section-card">
              <div className="section-card-title">
                <Brain size={18} color="#8B5CF6" />
                <span>Memory Facts ({results.memories.length})</span>
              </div>
              <div className="card-grid-3col">
                {results.memories.map((m) => (
                  <div key={m.id} className="stat-card-box" onClick={() => onNavigate('memory')} style={{ cursor: 'pointer' }}>
                    <p style={{ color: 'white', fontWeight: 500 }}>"{m.fact}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
