import React, { useState, useEffect } from 'react';
import { fetchAnalytics } from '../../services/api';
import { ChevronDown } from 'lucide-react';

export default function ProductivityCard() {
  const [data, setData] = useState({
    completed: 24,
    completionRate: 78,
    focusTime: '18h 30m',
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchAnalytics();
        setData({
          completed: res.completed_tasks ?? 24,
          completionRate: res.completion_rate ?? 78,
          focusTime: `${res.focus_time_hrs || 18.5}h`,
        });
      } catch (e) {
        console.warn('Analytics widget load error:', e);
      }
    }
    loadStats();
  }, []);

  const dashOffset = 251.2 * (1 - data.completionRate / 100);

  return (
    <div className="widget-card">
      <div className="widget-card-header">
        <span className="widget-card-title">Productivity Overview</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#94A3B8', cursor: 'pointer' }}>
          <span>This Week</span>
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="productivity-donut-box">
        {/* SVG Donut Progress Chart */}
        <div className="donut-svg-wrap">
          <svg width="90" height="90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#1E293B" strokeWidth="12" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#donutGradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray="251.2"
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="donutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#D946EF" />
              </linearGradient>
            </defs>
          </svg>
          <div className="donut-center-text">
            <div className="donut-percent-num">{data.completionRate}%</div>
            <div className="donut-percent-label">Productive</div>
          </div>
        </div>

        {/* Stats Legend */}
        <div className="productivity-stats-list">
          <div className="productivity-stat-item">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E' }}></span>
              Completed Tasks
            </span>
            <span style={{ fontWeight: 700, color: 'white' }}>{data.completed}</span>
          </div>

          <div className="productivity-stat-item">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6' }}></span>
              Focus Time
            </span>
            <span style={{ fontWeight: 700, color: 'white' }}>{data.focusTime}</span>
          </div>

          <div className="productivity-stat-item">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }}></span>
              Goals Achieved
            </span>
            <span style={{ fontWeight: 700, color: 'white' }}>{data.completed > 0 ? '8/10' : '0/10'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
