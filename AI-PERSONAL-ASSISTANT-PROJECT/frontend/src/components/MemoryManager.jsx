import React, { useState, useEffect } from 'react';
import { Brain, Plus, Search, Trash2, Edit2, User, Sliders, Briefcase, GraduationCap, Folder } from 'lucide-react';
import { fetchMemories as apiFetchMemories, createMemory as apiCreateMemory, toggleMemory as apiToggleMemory, deleteMemory as apiDeleteMemory } from '../services/api';

import PageHeader from './common/PageHeader';
import StatCard from './common/StatCard';
import EmptyState from './common/EmptyState';
import ToggleSwitch from './common/ToggleSwitch';

export default function MemoryManager() {
  const [memories, setMemories] = useState([]);
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [newFact, setNewFact] = useState('');
  const [category, setCategory] = useState('Personal');
  const [importance, setImportance] = useState('Medium');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [isAdding, setIsAdding] = useState(false);

  const loadMemories = async () => {
    try {
      const data = await apiFetchMemories();
      setMemories(data);
    } catch (e) {
      console.error('Failed to fetch memories', e);
    }
  };

  useEffect(() => {
    loadMemories();
  }, []);

  const handleCreateMemory = async (e) => {
    e.preventDefault();
    if (!newFact.trim()) return;
    try {
      await apiCreateMemory({ fact: newFact, category: category.toLowerCase(), importance });
      setNewFact('');
      setIsAdding(false);
      loadMemories();
    } catch (e) {
      console.error('Error creating memory', e);
    }
  };

  const handleToggle = async (id) => {
    try {
      await apiToggleMemory(id);
      loadMemories();
    } catch (e) {
      console.error('Error toggling memory', e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiDeleteMemory(id);
      loadMemories();
    } catch (e) {
      console.error('Error deleting memory', e);
    }
  };

  // Stats calculation
  const totalCount = memories.length;
  const personalCount = memories.filter((m) => m.category === 'personal').length;
  const prefCount = memories.filter((m) => m.category === 'preference').length;
  const activeCount = memories.filter((m) => m.is_active).length;

  // Filtering
  const filteredMemories = memories.filter((m) => {
    const matchesSearch = m.fact.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategoryFilter === 'All' || m.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const getCategoryIcon = (cat) => {
    switch (cat.toLowerCase()) {
      case 'personal':
        return User;
      case 'preference':
        return Sliders;
      case 'work':
        return Briefcase;
      case 'study':
        return GraduationCap;
      default:
        return Folder;
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <PageHeader
        icon={Brain}
        title="Smart AI Memory"
        description="Manage what Nexus AI remembers about you. Review, edit, organize, or remove saved memories anytime."
        actions={
          <ToggleSwitch
            active={memoryEnabled}
            onChange={setMemoryEnabled}
            label={memoryEnabled ? 'Memory System ON' : 'Memory System OFF'}
          />
        }
      />

      {/* Summary Stat Cards */}
      <div className="stats-cards-grid">
        <StatCard icon={Brain} title="Total Memories" value={totalCount} subtext="Saved AI facts" accentColor="#8B5CF6" />
        <StatCard icon={User} title="Personal" value={personalCount} subtext="Preferences & info" accentColor="#3B82F6" />
        <StatCard icon={Sliders} title="Preferences" value={prefCount} subtext="AI behavior settings" accentColor="#EC4899" />
        <StatCard icon={Brain} title="Active Memories" value={activeCount} subtext="Used in AI context" accentColor="#06B6D4" />
      </div>

      {/* Add New Memory Card */}
      <div className="section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="section-card-title">
            <Plus size={18} color="#C084FC" />
            <span>Add New Memory</span>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              style={{ background: 'var(--gradient-button)', border: 'none', color: 'white', padding: '8px 18px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              + Add Memory
            </button>
          )}
        </div>

        {isAdding && (
          <form onSubmit={handleCreateMemory} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            <input
              type="text"
              placeholder="Tell Nexus AI something to remember... (e.g. I am learning Python)"
              value={newFact}
              onChange={(e) => setNewFact(e.target.value)}
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', padding: '12px 16px', borderRadius: 'var(--radius-md)', outline: 'none', fontSize: '0.9rem' }}
              required
            />
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.88rem' }}
              >
                <option value="Personal">Personal</option>
                <option value="Preference">Preference</option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Other">Other</option>
              </select>

              <select
                value={importance}
                onChange={(e) => setImportance(e.target.value)}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.88rem' }}
              >
                <option value="High">Importance: High</option>
                <option value="Medium">Importance: Medium</option>
                <option value="Low">Importance: Low</option>
              </select>

              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', padding: '8px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: 'var(--gradient-button)', border: 'none', color: 'white', padding: '8px 20px', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Memory
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Memory Library Section */}
      <div className="section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="section-card-title">
            <Brain size={18} color="#8B5CF6" />
            <span>Memory Library ({filteredMemories.length})</span>
          </div>

          {/* Search & Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', padding: '6px 14px', borderRadius: 'var(--radius-full)' }}>
              <Search size={14} color="#94A3B8" />
              <input
                type="text"
                placeholder="Filter memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.85rem', width: '140px' }}
              />
            </div>

            <div className="filter-chips-row">
              {['All', 'Personal', 'Preference', 'Work', 'Study'].map((cat) => (
                <button
                  key={cat}
                  className={`chip-item-btn ${selectedCategoryFilter === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Memory Grid */}
        {filteredMemories.length === 0 ? (
          <EmptyState
            icon={Brain}
            title="No memories saved yet"
            description="Tell Nexus AI something about you and it will remember it here automatically during conversation."
            actionText="+ Add Your First Memory"
            onAction={() => setIsAdding(true)}
          />
        ) : (
          <div className="card-grid-3col">
            {filteredMemories.map((mem) => {
              const CatIcon = getCategoryIcon(mem.category);
              return (
                <div key={mem.id} className="stat-card-box" style={{ opacity: mem.is_active ? 1 : 0.5, gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-purple)', background: 'rgba(139, 92, 246, 0.15)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>
                      <CatIcon size={12} />
                      <span style={{ textTransform: 'uppercase' }}>{mem.category}</span>
                    </div>

                    <button
                      onClick={() => handleToggle(mem.id)}
                      style={{ background: mem.is_active ? 'var(--gradient-button)' : 'var(--bg-input)', color: 'white', border: 'none', padding: '2px 10px', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600 }}
                    >
                      {mem.is_active ? 'ACTIVE' : 'OFF'}
                    </button>
                  </div>

                  <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 500, lineHeight: 1.5 }}>
                    "{mem.fact}"
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    <span>Saved in memory</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleDelete(mem.id)} style={{ background: 'transparent', border: 'none', color: '#F87171', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
