import { useState } from 'react';
import './Calendar.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getMonthCells(month) {
    const monthIndex = month.getMonth();
    const year = month.getFullYear();
    const offset = new Date(year, monthIndex, 1).getDay();
    const dayCount = new Date(year, monthIndex + 1, 0).getDate();
    const cellCount = Math.ceil((offset + dayCount) / 7) * 7;
    return Array.from({ length: cellCount }, (_, index) => {
        const day = index - offset + 1;
        return day > 0 && day <= dayCount ? new Date(year, monthIndex, day) : null;
    });
}

function makeDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function Calendar({ exercisesByDate = {}, onDayClick }) {
  const [displayMonth, setDisplayMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const monthLabel = displayMonth.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });
  const cells = getMonthCells(displayMonth);
  const todayKey = makeDateKey(new Date());

  function changeMonth(offset) {
    setDisplayMonth((currentMonth) =>
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)
    );
  }

  function changeYear(offset) {
    setDisplayMonth((currentMonth) =>
      new Date(currentMonth.getFullYear() + offset, currentMonth.getMonth(), 1)
    );
  }

  function goToCurrentMonth() {
    const today = new Date();
    setDisplayMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  function handleDayClick(date) {
    const dateKey = makeDateKey(date);
    setSelectedDateKey(dateKey);
    onDayClick?.(date);
  }

  return (
    <main className="calendar-page">
      <header className="calendar-header">
        <div>
          <p className="calendar-eyebrow">TRAINING LOG</p>
          <h1>Workout Calendar</h1>
        </div>
        <div className="calendar-controls" aria-label="Calendar navigation">
          <button
            className="calendar-nav-button"
            type="button"
            aria-label="Previous year"
            onClick={() => changeYear(-1)}
          >
            &laquo;
          </button>
          <button
            className="calendar-nav-button"
            type="button"
            aria-label="Previous month"
            onClick={() => changeMonth(-1)}
          >
            &lt;
          </button>
          <h2 aria-live="polite">{monthLabel}</h2>
          <button
            className="calendar-nav-button"
            type="button"
            aria-label="Next month"
            onClick={() => changeMonth(1)}
          >
            &gt;
          </button>
          <button
            className="calendar-nav-button"
            type="button"
            aria-label="Next year"
            onClick={() => changeYear(1)}
          >
            &raquo;
          </button>
          <button className="calendar-today-button" type="button" onClick={goToCurrentMonth}>
            Today
          </button>
        </div>
      </header>

      <section className="calendar-surface" aria-label={`${monthLabel} workout calendar`}>
        <div className="calendar-grid calendar-weekdays" aria-hidden="true">
          {WEEKDAYS.map((weekday) => (
            <span key={weekday}>{weekday}</span>
          ))}
        </div>

        <div className="calendar-grid calendar-days">
          {cells.map((date, index) => {
            if (!date) {
              return <div className="calendar-empty-day" key={`empty-${index}`} aria-hidden="true" />;
            }

            const dateKey = makeDateKey(date);
            const workoutData = exercisesByDate[dateKey];
            const hasWorkout = Array.isArray(workoutData) ? workoutData.length > 0 : Boolean(workoutData);
            const accessibleDate = date.toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <button
                className={`calendar-day${dateKey === todayKey ? ' is-today' : ''}${dateKey === selectedDateKey ? ' is-selected' : ''}${hasWorkout ? ' has-workout' : ''}`}
                type="button"
                key={dateKey}
                aria-label={`${accessibleDate}${hasWorkout ? ', workout recorded' : ''}`}
                aria-pressed={dateKey === selectedDateKey}
                onClick={() => handleDayClick(date)}
              >
                <span>{date.getDate()}</span>
                {hasWorkout && <span className="calendar-workout-dot" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        <footer className="calendar-legend">
          <span className="calendar-workout-dot" aria-hidden="true" />
          <span>Workout recorded</span>
          {selectedDateKey && <span className="calendar-selected-date">Selected: {selectedDateKey}</span>}
        </footer>
      </section>
    </main>
  );
}