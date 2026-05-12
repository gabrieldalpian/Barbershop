'use client';

import { useState } from 'react';

interface CalendarPickerProps {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
}

const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function CalendarPicker({ value, onChange, minDate }: CalendarPickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minD = minDate ? new Date(minDate + 'T00:00:00') : today;

  const initialDate = value ? new Date(value + 'T12:00:00') : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    onChange(`${viewYear}-${m}-${d}`);
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const [y, mo, d] = value.split('-').map(Number);
    return y === viewYear && mo - 1 === viewMonth && d === day;
  };

  const isToday = (day: number) => {
    const t = new Date();
    return t.getFullYear() === viewYear && t.getMonth() === viewMonth && t.getDate() === day;
  };

  const isDisabled = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    date.setHours(0, 0, 0, 0);
    return date < minD;
  };

  const canGoPrev =
    viewYear > minD.getFullYear() ||
    (viewYear === minD.getFullYear() && viewMonth > minD.getMonth());

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectedLabel = value
    ? new Date(value + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Month/year header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <button
          type="button"
          onClick={goToPrevMonth}
          disabled={!canGoPrev}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold text-lg"
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className="font-bold text-gray-900 text-sm tracking-wide">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={goToNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 transition-colors font-bold text-lg"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="p-3">
        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_HEADERS.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1.5">
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) =>
            day === null ? (
              <div key={`empty-${i}`} />
            ) : (
              <button
                key={day}
                type="button"
                onClick={() => !isDisabled(day) && handleSelectDay(day)}
                disabled={isDisabled(day)}
                className={[
                  'aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all m-0.5',
                  isSelected(day)
                    ? 'bg-gold-500 text-black font-black shadow-sm scale-105'
                    : isToday(day) && !isDisabled(day)
                    ? 'border-2 border-gold-400 text-gold-700 font-semibold hover:bg-gold-50'
                    : isDisabled(day)
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100 cursor-pointer',
                ].join(' ')}
              >
                {day}
              </button>
            )
          )}
        </div>
      </div>

      {/* Selected date footer */}
      {selectedLabel ? (
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gold-50">
          <p className="text-xs text-center font-medium text-gold-700">
            Selected: {selectedLabel}
          </p>
        </div>
      ) : (
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-center text-gray-400">Select a date above</p>
        </div>
      )}
    </div>
  );
}
