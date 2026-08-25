import React, { useState, useEffect } from 'react';

export default function ScheduleCard({ onViewAll }) {
  const [scheduleItems, setScheduleItems] = useState([
    { time: '07:00 PM', text: 'Study Python', type: 'Reminder', color: '#EC4899' },
    { time: '08:30 PM', text: 'AI Project Work', type: 'Task', color: '#3B82F6' },
    { time: '09:30 PM', text: 'Exercise', type: 'Reminder', color: '#EC4899' },
  ]);

  useEffect(() => {
    // Fetch live schedule / tasks from backend
    const fetchLiveSchedule = async () => {
      try {
        const [resRem, resTasks] = await Promise.all([
          fetch('http://localhost:8000/api/reminders'),
          fetch('http://localhost:8000/api/tasks')
        ]);

        const items = [];
        if (resRem.ok) {
          const rems = await resRem.json();
          rems.slice(0, 2).forEach(r => items.push({ time: r.time, text: r.task, type: 'Reminder', color: '#EC4899' }));
        }
        if (resTasks.ok) {
          const tsks = await resTasks.json();
          tsks.slice(0, 2).forEach(t => items.push({ time: t.due_time || '08:00 PM', text: t.title, type: 'Task', color: '#3B82F6' }));
        }

        if (items.length > 0) {
          setScheduleItems(items);
        }
      } catch (e) {
        console.error('Schedule fetch error', e);
      }
    };
    fetchLiveSchedule();
  }, []);

  return (
    <div className="widget-card">
      <div className="widget-card-header">
        <span className="widget-card-title">Today's Schedule</span>
        <span className="widget-view-all" onClick={onViewAll}>View All</span>
      </div>

      <div className="schedule-list">
        {scheduleItems.map((item, idx) => (
          <div key={idx} className="schedule-item-row" style={{ borderLeftColor: item.color }}>
            <span className="schedule-time">{item.time}</span>
            <span className="schedule-text">{item.text}</span>
            <span className="schedule-badge" style={{ color: item.color, background: `${item.color}20` }}>
              {item.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
