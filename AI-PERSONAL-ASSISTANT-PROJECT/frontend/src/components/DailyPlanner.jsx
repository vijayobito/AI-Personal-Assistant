import React, { useState, useEffect } from 'react';
import { CalendarRange, Sparkles, Clock, Sun, Moon, Sunset, CheckCircle2, RotateCcw } from 'lucide-react';
import { fetchTodayPlan as apiFetchTodayPlan, generateDailyPlan as apiGenerateDailyPlan } from '../services/api';

import PageHeader from './common/PageHeader';
import StatCard from './common/StatCard';
import EmptyState from './common/EmptyState';

export default function DailyPlanner() {
  const [plan, setPlan] = useState(null);
  const [activitiesInput, setActivitiesInput] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTodayPlan = async () => {
    try {
      const data = await apiFetchTodayPlan();
      setPlan(data);
    } catch (e) {
      console.error('Failed to fetch today plan', e);
    }
  };

  useEffect(() => {
    fetchTodayPlan();
  }, []);

  const handleGeneratePlan = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    const acts = activitiesInput.split(',').map((a) => a.trim()).filter(Boolean);

    try {
      const data = await apiGenerateDailyPlan(acts, 'Today');
      setPlan(data);
    } catch (e) {
      console.error('Error generating daily plan', e);
    } finally {
      setLoading(false);
    }
  };

  const scheduleSlots = plan?.schedule || [];

  // Parse hour from time strings like "9:00 AM", "2:00 PM", "7:00 PM"
  const parseHour = (timeStr) => {
    const match = timeStr.match(/(\d+)(?::\d+)?\s*(AM|PM)/i);
    if (!match) return 0;
    let hour = parseInt(match[1]);
    const period = match[2].toUpperCase();
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return hour;
  };

  const morningSlots = scheduleSlots.filter((s) => parseHour(s.time) < 12);
  const afternoonSlots = scheduleSlots.filter((s) => { const h = parseHour(s.time); return h >= 12 && h < 18; });
  const eveningSlots = scheduleSlots.filter((s) => parseHour(s.time) >= 18);

  return (
    <div className="page-container">
      {/* Page Header */}
      <PageHeader
        icon={CalendarRange}
        title="AI Daily Schedule Planner"
        description="Tell AI your tasks or goals for today and receive an optimized, time-blocked daily schedule."
      />

      {/* Summary Stat Cards */}
      <div className="stats-cards-grid">
        <StatCard icon={CalendarRange} title="Total Slots" value={scheduleSlots.length} subtext="Scheduled activities" accentColor="#8B5CF6" />
        <StatCard icon={Sun} title="Morning" value={morningSlots.length || 2} subtext="Focus study window" accentColor="#F59E0B" />
        <StatCard icon={Sunset} title="Afternoon" value={afternoonSlots.length || 1} subtext="Core project work" accentColor="#3B82F6" />
        <StatCard icon={Moon} title="Evening" value={eveningSlots.length || 1} subtext="Exercise & review" accentColor="#EC4899" />
      </div>

      {/* AI Schedule Generator Card */}
      <div className="section-card">
        <div className="section-card-title">
          <Sparkles size={18} color="#C084FC" />
          <span>Generate AI Daily Schedule</span>
        </div>

        <form onSubmit={handleGeneratePlan} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Enter your goals/activities for today (e.g. Study Python, Work on AI project, Exercise, Review progress)"
            value={activitiesInput}
            onChange={(e) => setActivitiesInput(e.target.value)}
            style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', padding: '12px 18px', borderRadius: 'var(--radius-lg)', outline: 'none', fontSize: '0.92rem' }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ background: 'var(--gradient-button)', border: 'none', color: 'white', padding: '0 28px', borderRadius: 'var(--radius-lg)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {loading ? 'Generating...' : '✨ Generate Schedule'}
          </button>
        </form>
      </div>

      {/* Timeline Schedule Sections */}
      {scheduleSlots.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title="No daily plan created yet"
          description="Type your goals above to let Gemini AI build a time-blocked schedule for you."
          actionText="✨ Generate Default Schedule"
          onAction={() => handleGeneratePlan()}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Morning Window */}
          {(morningSlots.length > 0 || (afternoonSlots.length === 0 && eveningSlots.length === 0)) && (
            <div className="section-card">
              <div className="section-card-title" style={{ color: '#F59E0B' }}>
                <Sun size={18} />
                <span>Morning Focus Window</span>
              </div>
              <div className="planner-timeline">
                {(morningSlots.length > 0 ? morningSlots : scheduleSlots.slice(0, 2)).map((item, idx) => (
                  <div key={idx} className="schedule-slot" style={{ borderLeft: '3px solid #F59E0B' }}>
                    <div className="slot-time" style={{ color: '#F59E0B' }}>{item.time}</div>
                    <div style={{ flex: 1, color: 'white', fontWeight: 600 }}>{item.activity}</div>
                    <span className="schedule-badge" style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.15)' }}>
                      Scheduled
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Afternoon Window */}
          {afternoonSlots.length > 0 && (
            <div className="section-card">
              <div className="section-card-title" style={{ color: '#3B82F6' }}>
                <Sunset size={18} />
                <span>Afternoon Deep Work</span>
              </div>
              <div className="planner-timeline">
                {afternoonSlots.map((item, idx) => (
                  <div key={idx} className="schedule-slot" style={{ borderLeft: '3px solid #3B82F6' }}>
                    <div className="slot-time" style={{ color: '#3B82F6' }}>{item.time}</div>
                    <div style={{ flex: 1, color: 'white', fontWeight: 600 }}>{item.activity}</div>
                    <span className="schedule-badge" style={{ color: '#3B82F6', background: 'rgba(59, 130, 246, 0.15)' }}>
                      Scheduled
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evening Window */}
          {(eveningSlots.length > 0 || afternoonSlots.length === 0) && (
            <div className="section-card">
              <div className="section-card-title" style={{ color: '#EC4899' }}>
                <Moon size={18} />
                <span>Evening Review & Balance</span>
              </div>
              <div className="planner-timeline">
                {(eveningSlots.length > 0 ? eveningSlots : scheduleSlots.slice(2)).map((item, idx) => (
                  <div key={idx} className="schedule-slot" style={{ borderLeft: '3px solid #EC4899' }}>
                    <div className="slot-time" style={{ color: '#EC4899' }}>{item.time}</div>
                    <div style={{ flex: 1, color: 'white', fontWeight: 600 }}>{item.activity}</div>
                    <span className="schedule-badge" style={{ color: '#EC4899', background: 'rgba(236, 72, 153, 0.15)' }}>
                      Scheduled
                    </span>
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
