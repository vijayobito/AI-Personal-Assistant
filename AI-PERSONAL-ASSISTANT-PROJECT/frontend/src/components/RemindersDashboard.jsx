import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000/api';

export function RemindersDashboard() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/reminders`);
      if (res.ok) {
        const data = await res.json();
        setReminders(data);
      }
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!task || !date || !time) return;

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, date, time }),
      });
      if (res.ok) {
        setTask('');
        setDate('');
        setTime('');
        fetchReminders();
      }
    } catch (err) {
      console.error('Failed to create reminder:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/reminders/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchReminders();
      }
    } catch (err) {
      console.error('Failed to delete reminder:', err);
    }
  };

  return (
    <div className="reminders-dashboard">
      <div className="dashboard-header">
        <h2>⏰ Reminders Dashboard</h2>
        <p>Manage your upcoming schedule, tasks, and automated reminders</p>
      </div>

      <div className="dashboard-grid">
        <form className="reminder-form-card" onSubmit={handleCreate}>
          <h3>➕ Add New Reminder</h3>
          <div className="form-group">
            <label>Task / Title</label>
            <input
              type="text"
              placeholder="e.g. Study Python, Team Sync"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="text"
                placeholder="e.g. Tomorrow, 2026-08-25"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input
                type="text"
                placeholder="e.g. 7:00 PM, 19:00"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Reminder'}
          </button>
        </form>

        <div className="reminders-list-card">
          <h3>📌 Upcoming Reminders</h3>
          {loading ? (
            <div className="loading-spinner">Loading reminders...</div>
          ) : reminders.length === 0 ? (
            <div className="empty-state">
              No reminders scheduled. Try typing <em>"Remind me to study Python tomorrow at 7 PM"</em> in the AI chat!
            </div>
          ) : (
            <div className="reminders-list">
              {reminders.map((rem) => (
                <div key={rem.id} className="reminder-item">
                  <div className="reminder-info">
                    <h4>{rem.task}</h4>
                    <div className="reminder-meta">
                      <span className="badge date-badge">📅 {rem.date}</span>
                      <span className="badge time-badge">⏰ {rem.time}</span>
                    </div>
                  </div>
                  <button
                    className="delete-btn"
                    title="Delete Reminder"
                    onClick={() => handleDelete(rem.id)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
