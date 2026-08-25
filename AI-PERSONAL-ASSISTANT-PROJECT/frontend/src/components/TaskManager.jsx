import React, { useState, useEffect } from 'react';
import { CheckSquare, Bell, Plus, Calendar, Clock, RotateCcw, Trash2, CheckCircle2 } from 'lucide-react';
import { fetchTasks as apiFetchTasks, createTask as apiCreateTask, completeTask as apiCompleteTask, deleteTask as apiDeleteTask, fetchReminders as apiFetchReminders, createReminder as apiCreateReminder, deleteReminder as apiDeleteReminder } from '../services/api';

import PageHeader from './common/PageHeader';
import StatCard from './common/StatCard';
import EmptyState from './common/EmptyState';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks');
  const [filterPriority, setFilterPriority] = useState('All');

  // Task form state
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('Today');
  const [dueTime, setDueTime] = useState('7:00 PM');
  const [category, setCategory] = useState('General');
  const [recurrence, setRecurrence] = useState('none');
  const [isAdding, setIsAdding] = useState(false);

  // Reminder form state
  const [remTask, setRemTask] = useState('');
  const [remDate, setRemDate] = useState('Tomorrow');
  const [remTime, setRemTime] = useState('7:00 PM');
  const [remPriority, setRemPriority] = useState('Medium');

  const loadData = async () => {
    try {
      const [tList, rList] = await Promise.all([apiFetchTasks(), apiFetchReminders()]);
      setTasks(tList);
      setReminders(rList);
    } catch (e) {
      console.error('Failed to fetch tasks/reminders', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await apiCreateTask({ title, priority, due_date: dueDate, due_time: dueTime, category, recurrence });
      setTitle('');
      setIsAdding(false);
      loadData();
    } catch (e) {
      console.error('Error creating task', e);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      await apiCompleteTask(id);
      loadData();
    } catch (e) {
      console.error('Error toggling task completion', e);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await apiDeleteTask(id);
      loadData();
    } catch (e) {
      console.error('Error deleting task', e);
    }
  };

  const handleCreateReminder = async (e) => {
    e.preventDefault();
    if (!remTask.trim()) return;
    try {
      await apiCreateReminder({ task: remTask, date: remDate, time: remTime, priority: remPriority });
      setRemTask('');
      loadData();
    } catch (e) {
      console.error('Error creating reminder', e);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await apiDeleteReminder(id);
      loadData();
    } catch (e) {
      console.error('Error deleting reminder', e);
    }
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const highCount = tasks.filter((t) => t.priority === 'High').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalReminders = reminders.length;

  const filteredTasks = tasks.filter(
    (t) => filterPriority === 'All' || t.priority.toLowerCase() === filterPriority.toLowerCase()
  );

  return (
    <div className="page-container">
      {/* Page Header */}
      <PageHeader
        icon={CheckSquare}
        title="Smart Tasks & Reminders"
        description="Manage your tasks with priority badges, recurring schedules, categories, and timely reminder alerts."
        actions={
          <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`chip-item-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            >
              Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab('reminders')}
              className={`chip-item-btn ${activeTab === 'reminders' ? 'active' : ''}`}
            >
              Reminders ({reminders.length})
            </button>
          </div>
        }
      />

      {/* Summary Stat Cards */}
      <div className="stats-cards-grid">
        <StatCard icon={CheckSquare} title="Total Tasks" value={totalTasks} subtext="Active task list" accentColor="#3B82F6" />
        <StatCard icon={CheckSquare} title="High Priority" value={highCount} subtext="Needs immediate action" accentColor="#F87171" />
        <StatCard icon={CheckCircle2} title="Completed" value={completedCount} subtext="Tasks done" accentColor="#22C55E" />
        <StatCard icon={Bell} title="Reminders" value={totalReminders} subtext="Upcoming alerts" accentColor="#EC4899" />
      </div>

      {activeTab === 'tasks' ? (
        <>
          {/* Create Task Card */}
          <div className="section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="section-card-title">
                <Plus size={18} color="#C084FC" />
                <span>Create New Task</span>
              </div>
              {!isAdding && (
                <button
                  onClick={() => setIsAdding(true)}
                  style={{ background: 'var(--gradient-button)', border: 'none', color: 'white', padding: '8px 18px', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  + New Task
                </button>
              )}
            </div>

            {isAdding && (
              <form onSubmit={handleCreateTask} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '10px' }}>
                <input
                  type="text"
                  placeholder="Task Title (e.g. Finish Python Project)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ gridColumn: 'span 2', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', padding: '12px', borderRadius: 'var(--radius-md)', outline: 'none' }}
                  required
                />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', padding: '12px', borderRadius: 'var(--radius-md)' }}
                >
                  <option value="High">Priority: High</option>
                  <option value="Medium">Priority: Medium</option>
                  <option value="Low">Priority: Low</option>
                </select>
                <input
                  type="text"
                  placeholder="Category (e.g. Work, Study)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', padding: '12px', borderRadius: 'var(--radius-md)' }}
                />
                <input
                  type="text"
                  placeholder="Due Date (e.g. Today)"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', padding: '12px', borderRadius: 'var(--radius-md)' }}
                />
                <input
                  type="text"
                  placeholder="Due Time (e.g. 7:00 PM)"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', padding: '12px', borderRadius: 'var(--radius-md)' }}
                />
                <select
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value)}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', padding: '12px', borderRadius: 'var(--radius-md)' }}
                >
                  <option value="none">Repeat: None</option>
                  <option value="daily">Repeat: Daily</option>
                  <option value="weekly">Repeat: Weekly</option>
                </select>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', padding: '8px 18px', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button type="submit" style={{ background: 'var(--gradient-button)', border: 'none', color: 'white', padding: '8px 24px', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>
                    Save Task
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Task Grid Section */}
          <div className="section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="section-card-title">
                <CheckSquare size={18} color="#3B82F6" />
                <span>Task List ({filteredTasks.length})</span>
              </div>
              <div className="filter-chips-row">
                {['All', 'High', 'Medium', 'Low'].map((p) => (
                  <button key={p} className={`chip-item-btn ${filterPriority === p ? 'active' : ''}`} onClick={() => setFilterPriority(p)}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {filteredTasks.length === 0 ? (
              <EmptyState
                icon={CheckSquare}
                title="No tasks found"
                description="Get started by creating your first task or daily goal."
                actionText="+ Add Task"
                onAction={() => setIsAdding(true)}
              />
            ) : (
              <div className="card-grid-3col">
                {filteredTasks.map((t) => (
                  <div key={t.id} className="stat-card-box" style={{ opacity: t.status === 'completed' ? 0.6 : 1, gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`badge-priority-${t.priority.toLowerCase()}`}>{t.priority} Priority</span>
                      {t.recurrence !== 'none' && (
                        <span style={{ fontSize: '0.75rem', background: 'rgba(139, 92, 246, 0.15)', color: '#C084FC', padding: '2px 8px', borderRadius: '10px' }}>
                          <RotateCcw size={10} style={{ marginRight: '4px' }} />
                          {t.recurrence}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'white', textDecoration: t.status === 'completed' ? 'line-through' : 'none' }}>
                      {t.title}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <Clock size={14} color="#EC4899" />
                      <span>{t.due_date} at {t.due_time}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                      <button
                        onClick={() => handleToggleComplete(t.id)}
                        style={{ flex: 1, background: t.status === 'completed' ? 'var(--bg-input)' : 'var(--gradient-button)', border: 'none', color: 'white', padding: '8px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                      >
                        {t.status === 'completed' ? '✓ Completed' : 'Mark Done'}
                      </button>
                      <button onClick={() => handleDeleteTask(t.id)} style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#F87171', padding: '8px 12px', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Create Reminder Card */}
          <div className="section-card">
            <div className="section-card-title">
              <Bell size={18} color="#EC4899" />
              <span>Create New Reminder</span>
            </div>

            <form onSubmit={handleCreateReminder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <input
                type="text"
                placeholder="Reminder Activity (e.g. Study Python)"
                value={remTask}
                onChange={(e) => setRemTask(e.target.value)}
                style={{ gridColumn: 'span 2', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', padding: '12px', borderRadius: 'var(--radius-md)' }}
                required
              />
              <input
                type="text"
                placeholder="Date (e.g. Tomorrow)"
                value={remDate}
                onChange={(e) => setRemDate(e.target.value)}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', padding: '12px', borderRadius: 'var(--radius-md)' }}
              />
              <input
                type="text"
                placeholder="Time (e.g. 7:00 PM)"
                value={remTime}
                onChange={(e) => setRemTime(e.target.value)}
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', padding: '12px', borderRadius: 'var(--radius-md)' }}
              />
              <button type="submit" style={{ gridColumn: '1 / -1', background: 'var(--gradient-button)', border: 'none', color: 'white', padding: '12px', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>
                + Add Reminder Alert
              </button>
            </form>
          </div>

          {/* Reminders List */}
          <div className="section-card">
            <div className="section-card-title">
              <Bell size={18} color="#EC4899" />
              <span>Reminders List ({reminders.length})</span>
            </div>

            {reminders.length === 0 ? (
              <EmptyState icon={Bell} title="No reminders set" description="Set a reminder for important tasks or deadlines." />
            ) : (
              <div className="card-grid-3col">
                {reminders.map((r) => (
                  <div key={r.id} className="stat-card-box">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Bell size={18} color="#EC4899" />
                      <span style={{ fontWeight: 600, color: 'white' }}>{r.task}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{r.date} at {r.time}</p>
                    <button onClick={() => handleDeleteReminder(r.id)} style={{ alignSelf: 'flex-end', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#F87171', padding: '4px 10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', marginTop: 'auto' }}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
