import React, { useState } from 'react';
import type { WeeklyMenu } from '../types';

interface WeeklyMenuDisplayProps {
  weeklyMenu: WeeklyMenu;
  currentDate: Date;
  onAddMenu: (date: string, menu: string) => void;
  onCopyWeekMenu: (weekNumber: 1 | 2) => void;
  onRepeatWeeks: () => void;
}

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const WeeklyMenuDisplay: React.FC<WeeklyMenuDisplayProps> = ({ weeklyMenu, currentDate, onAddMenu, onCopyWeekMenu, onRepeatWeeks }) => {
  const [menu, setMenu] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAdd = () => {
    if (selectedDate && menu) {
      onAddMenu(selectedDate, menu);
      setMenu('');
    }
  };

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
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-bold text-slate-700">Semana {weekNumber}</h4>
          <button onClick={() => onCopyWeekMenu(weekNumber <= 2 ? weekNumber as 1 | 2 : (weekNumber - 2) as 1 | 2)} className="px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Copiar Semana
          </button>
        </div>
        <div className="space-y-2">
          {days.map((day) => {
            const dateKey = day.toISOString().split('T')[0];
            const menu = weeklyMenu[dateKey];
            return (
              <div key={dateKey} className="flex items-center justify-between p-2 rounded-md bg-slate-50">
                <span className="font-semibold text-slate-600">{WEEKDAYS[day.getDay()]} {String(day.getDate()).padStart(2, '0')}</span>
                <span className="text-slate-800">{menu || 'No definido'}</span>
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
      <div className="space-y-4 mb-6">
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)} 
          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <input 
          type="text" 
          placeholder="Descripción del menú..."
          value={menu} 
          onChange={(e) => setMenu(e.target.value)} 
          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <button onClick={handleAdd} className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Añadir Menú
        </button>
        <button onClick={onRepeatWeeks} className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          Repetir Semanas 1 y 2
        </button>
      </div>
      <div className="space-y-6">
        {renderWeek(1)}
        {renderWeek(2)}
        {renderWeek(3)}
        {renderWeek(4)}
      </div>
    </div>
  );
};