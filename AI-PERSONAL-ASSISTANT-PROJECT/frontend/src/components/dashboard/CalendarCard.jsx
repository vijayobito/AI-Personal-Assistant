import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarCard({ scheduledDates = [24, 25, 28], onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const activeDay = isCurrentMonth ? today.getDate() : null;

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="widget-card">
      <div className="calendar-widget-box">
        <div className="calendar-header-row">
          <span>Calendar</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ChevronLeft size={16} onClick={handlePrevMonth} style={{ cursor: 'pointer', color: '#94A3B8' }} />
            <span style={{ color: 'white', fontWeight: 600 }}>{monthNames[month]} {year}</span>
            <ChevronRight size={16} onClick={handleNextMonth} style={{ cursor: 'pointer', color: '#94A3B8' }} />
          </div>
        </div>

        <div className="calendar-days-grid">
          {daysOfWeek.map((d, i) => (
            <div key={i} className="calendar-day-head">{d}</div>
          ))}

          {/* Empty lead cells */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day-cell empty" style={{ opacity: 0.2 }}></div>
          ))}

          {/* Actual days grid */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isToday = dayNum === activeDay;
            const hasEvent = scheduledDates.includes(dayNum);
            return (
              <div
                key={dayNum}
                onClick={() => onSelectDate && onSelectDate(new Date(year, month, dayNum))}
                className={`calendar-day-cell ${isToday ? 'active-today' : ''}`}
                style={{ position: 'relative', cursor: 'pointer' }}
              >
                {dayNum}
                {hasEvent && !isToday && (
                  <span style={{ position: 'absolute', bottom: '3px', width: '4px', height: '4px', background: '#a855f7', borderRadius: '50%' }}></span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
