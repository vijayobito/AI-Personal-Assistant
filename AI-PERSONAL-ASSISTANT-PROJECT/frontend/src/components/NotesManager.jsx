import React, { useState, useEffect } from 'react';
import { StickyNote, Plus, Search, Star, Trash2, Tag, Sparkles, Wand2 } from 'lucide-react';
import { fetchNotes as apiFetchNotes, createNote as apiCreateNote, togglePinNote as apiTogglePin, deleteNote as apiDeleteNote, performAINoteAction } from '../services/api';

import PageHeader from './common/PageHeader';
import StatCard from './common/StatCard';
import EmptyState from './common/EmptyState';

export default function NotesManager() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [aiNoteOutput, setAiNoteOutput] = useState(null);

  const loadNotes = async () => {
    try {
      const data = await apiFetchNotes(searchQuery);
      setNotes(data);
    } catch (e) {
      console.error('Failed to fetch notes', e);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [searchQuery]);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      await apiCreateNote({ title, content, tags, is_pinned: isPinned });
      setTitle('');
      setContent('');
      setTags('');
      setIsPinned(false);
      setIsAdding(false);
      loadNotes();
    } catch (e) {
      console.error('Error creating note', e);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      await apiTogglePin(id);
      loadNotes();
    } catch (e) {
      console.error('Error toggling pin note', e);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await apiDeleteNote(id);
      loadNotes();
    } catch (e) {
      console.error('Error deleting note', e);
    }
  };

  const handleAiAction = async (id, action) => {
    try {
      setAiNoteOutput('Processing AI action...');
      const res = await performAINoteAction(id, action);
      setAiNoteOutput(res.result);
    } catch (e) {
      console.error('Error performing AI note action', e);
      setAiNoteOutput('Failed to process note with AI.');
    }
  };

  // Stats calculation
  const totalNotes = notes.length;
  const pinnedCount = notes.filter((n) => n.is_pinned).length;
  const tagCategories = Array.from(new Set(notes.flatMap((n) => n.tags ? n.tags.split(',').map((t) => t.trim()) : [])));

  const filteredNotes = notes.filter(
    (n) => selectedTag === 'All' || (n.tags && n.tags.toLowerCase().includes(selectedTag.toLowerCase()))
  );

  return (
    <div className="page-container">
      {/* Page Header */}
      <PageHeader
        icon={StickyNote}
        title="AI-Powered Notes Center"
        description="Create, tag, search, pin, and organize notes with automated AI writing tools."
      />

      {/* Summary Stat Cards */}
      <div className="stats-cards-grid">
        <StatCard icon={StickyNote} title="Total Notes" value={totalNotes} subtext="Saved knowledge" accentColor="#F59E0B" />
        <StatCard icon={Star} title="Pinned Notes" value={pinnedCount} subtext="Important notes" accentColor="#8B5CF6" />
        <StatCard icon={Tag} title="Tag Categories" value={tagCategories.length} subtext="Unique topics" accentColor="#06B6D4" />
        <StatCard icon={Sparkles} title="AI Writing Tools" value="Active" subtext="Summarize & Improve" accentColor="#EC4899" />
      </div>

      {/* AI Action Result Banner */}
      {aiNoteOutput && (
        <div className="section-card" style={{ border: '1px solid rgba(168,85,247,0.4)', background: 'rgba(168,85,247,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, color: '#c084fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wand2 size={16} /> AI Output Result
            </span>
            <button onClick={() => setAiNoteOutput(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
          </div>
          <p style={{ color: '#f8fafc', whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: 1.5 }}>{aiNoteOutput}</p>
        </div>
      )}

      {/* Create Note Card */}
      <div className="section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="section-card-title">
            <Plus size={18} color="#F59E0B" />
            <span>Create New Note</span>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              style={{ background: 'var(--gradient-button)', border: 'none', color: 'white', padding: '8px 18px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              + Create Note
            </button>
          )}
        </div>

        {isAdding && (
          <form onSubmit={handleCreateNote} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            <input
              type="text"
              placeholder="Note Title (e.g. Learn FastAPI Authentication)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', padding: '12px', borderRadius: 'var(--radius-md)', outline: 'none' }}
              required
            />
            <textarea
              rows={4}
              placeholder="Write your note content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', padding: '12px', borderRadius: 'var(--radius-md)', outline: 'none', resize: 'vertical' }}
              required
            />
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Tags (e.g. fastapi, auth, python)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} />
                <span>Pin Note</span>
              </label>

              <button type="button" onClick={() => setIsAdding(false)} style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', padding: '8px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" style={{ background: 'var(--gradient-button)', border: 'none', color: 'white', padding: '8px 22px', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>
                Save Note
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Notes Grid Section */}
      <div className="section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="section-card-title">
            <StickyNote size={18} color="#F59E0B" />
            <span>Notes Collection ({filteredNotes.length})</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', padding: '6px 14px', borderRadius: 'var(--radius-full)' }}>
              <Search size={14} color="#94A3B8" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.85rem', width: '140px' }}
              />
            </div>

            <div className="filter-chips-row">
              <button className={`chip-item-btn ${selectedTag === 'All' ? 'active' : ''}`} onClick={() => setSelectedTag('All')}>
                All
              </button>
              {tagCategories.map((tag) => (
                <button key={tag} className={`chip-item-btn ${selectedTag === tag ? 'active' : ''}`} onClick={() => setSelectedTag(tag)}>
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredNotes.length === 0 ? (
          <EmptyState
            icon={StickyNote}
            title="No notes saved"
            description="Create your first note to store study materials, project ideas, or AI summaries."
            actionText="+ Create First Note"
            onAction={() => setIsAdding(true)}
          />
        ) : (
          <div className="card-grid-3col">
            {filteredNotes.map((n) => (
              <div key={n.id} className="stat-card-box" style={{ gap: '12px', border: n.is_pinned ? '1px solid rgba(245,158,11,0.5)' : '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'white' }}>{n.title}</h3>
                  <button onClick={() => handleTogglePin(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Star size={16} color="#F59E0B" fill={n.is_pinned ? '#F59E0B' : 'transparent'} />
                  </button>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap', lineHeight: 1.5, flex: 1 }}>
                  {n.content}
                </p>

                {n.tags && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {n.tags.split(',').map((tag, idx) => (
                      <span key={idx} style={{ fontSize: '0.72rem', background: 'rgba(139, 92, 246, 0.15)', color: '#C084FC', padding: '2px 8px', borderRadius: '10px' }}>
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => handleAiAction(n.id, 'summarize')} style={{ fontSize: '0.72rem', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc', padding: '2px 8px', borderRadius: '6px', cursor: 'pointer' }}>
                      Summarize
                    </button>
                    <button onClick={() => handleAiAction(n.id, 'key_points')} style={{ fontSize: '0.72rem', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', padding: '2px 8px', borderRadius: '6px', cursor: 'pointer' }}>
                      Key Points
                    </button>
                  </div>
                  <button onClick={() => handleDeleteNote(n.id)} style={{ background: 'transparent', border: 'none', color: '#F87171', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
