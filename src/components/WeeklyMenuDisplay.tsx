import React, { useState } from 'react';
import type { WeeklyMenu } from '../types';

interface WeeklyMenuDisplayProps {
  weeklyMenu: WeeklyMenu;
  currentDate: Date;
  onAddMenu: (date: string, menu: string) => void;
}

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const EditableMenu: React.FC<{ dateKey: string; menu: string; onSave: (date: string, newMenu: string) => void; }> = ({ dateKey, menu, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(menu || '');

  const handleSave = () => {
    onSave(dateKey, text);
    setIsEditing(false);
  };

  return isEditing ? (
    <input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => e.key === 'Enter' && handleSave()}
      className="w-full px-2 py-1 text-sm rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      autoFocus
    />
  ) : (
    <span onClick={() => setIsEditing(true)} className="text-slate-800 cursor-pointer hover:bg-slate-100 rounded-md px-2 py-1">
      {menu || 'No definido'}
    </span>
  );
};

export const WeeklyMenuDisplay: React.FC<WeeklyMenuDisplayProps> = ({ weeklyMenu, currentDate, onAddMenu }) => {
  const renderWeek = (weekNumber: 1 | 2 | 3 | 4) => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1) + (weekNumber - 1) * 7);

    const days = Array.from({ length: 5 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });

    return (
      <div key={weekNumber}>
        <h4 className="text-lg font-bold text-slate-700 mb-2">Semana {weekNumber}</h4>
        <div className="space-y-2">
          {days.map((day) => {
            const dateKey = day.toISOString().split('T')[0];
            const menu = weeklyMenu[dateKey];
            return (
              <div key={dateKey} className="flex items-center justify-between p-2 rounded-md bg-slate-50">
                <span className="font-semibold text-slate-600">{WEEKDAYS[day.getDay()]} {String(day.getDate()).padStart(2, '0')}</span>
                <EditableMenu dateKey={dateKey} menu={menu} onSave={onAddMenu} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Menú del Mes</h3>
      <div className="space-y-6">
        {renderWeek(1)}
        {renderWeek(2)}
        {renderWeek(3)}
        {renderWeek(4)}
      </div>
    </div>
  );
};