
import React from 'react';
import type { WeeklyMenu } from '../types';

interface WeeklyMenuDisplayProps {
  weeklyMenu: WeeklyMenu;
  currentDate: Date;
}

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const WeeklyMenuDisplay: React.FC<WeeklyMenuDisplayProps> = ({ weeklyMenu, currentDate }) => {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1)); // Adjust to Monday as start of week

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Menú de la Semana</h3>
      <div className="space-y-3">
        {days.map((day, index) => {
          const dateKey = day.toISOString().split('T')[0];
          const menu = weeklyMenu[dateKey];
          return (
            <div key={dateKey} className="flex items-center justify-between p-2 rounded-md bg-slate-50">
              <span className="font-semibold text-slate-600">{WEEKDAYS[day.getDay()]} {day.getDate()}</span>
              <span className="text-slate-800">{menu || 'No definido'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
