
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MealType, WeeklyMenu } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface CalendarProps {
    currentDate: Date;
    selections: Record<string, MealType>;
    weeklyMenu: WeeklyMenu;
    onDateChange: (date: Date) => void;
    onSelectMeal: (date: string, mealType: MealType) => void;
}

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const getMealTypeColor = (mealType?: MealType) => {
    if (!mealType) return 'bg-white hover:bg-slate-100';
    switch (mealType) {
        case MealType.Menu: return 'bg-green-200 text-green-800 hover:bg-green-300';
        case MealType.Vianda: return 'bg-blue-200 text-blue-800 hover:bg-blue-300';
        case MealType.Absent: return 'bg-slate-300 text-slate-600 hover:bg-slate-400';
        case MealType.NoClasses: return 'bg-amber-200 text-amber-800 hover:bg-amber-300';
        default: return 'bg-white hover:bg-slate-100';
    }
};

interface DayCellProps {
    day: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    selection?: MealType;
    onClick: () => void;
}

const DayCell: React.FC<DayCellProps> = ({ day, isCurrentMonth, isToday, selection, onClick }) => {
    const dayClass = isCurrentMonth ? 'text-slate-800' : 'text-slate-400';
    const todayClass = isToday ? 'ring-2 ring-indigo-500 ring-offset-2' : '';
    const colorClass = getMealTypeColor(selection);

    return (
        <div 
            onClick={onClick}
            className={`relative flex flex-col items-center justify-center h-24 cursor-pointer rounded-lg transition-colors duration-200 p-2 text-center ${colorClass} ${dayClass}`}
        >
            <span className={`absolute top-1 right-2 text-xs font-medium ${isCurrentMonth ? 'text-slate-600' : 'text-slate-400'}`}>
                {day.getDate()}
            </span>
            {isToday && <div className={`absolute top-1 left-2 w-1.5 h-1.5 bg-indigo-500 rounded-full ${todayClass}`}></div>}
            {selection && <p className="text-xs mt-2 font-semibold text-gray-700">{selection}</p>}
        </div>
    );
};

interface SelectionPopoverProps {
    targetRef: React.RefObject<HTMLDivElement>;
    onSelect: (mealType: MealType) => void;
    onClose: () => void;
}

const SelectionPopover: React.FC<SelectionPopoverProps> = ({ targetRef, onSelect, onClose }) => {
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node) && targetRef.current && !targetRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose, targetRef]);
    
    if (!targetRef.current) return null;

    const rect = targetRef.current.getBoundingClientRect();
    const style = {
        top: `${rect.bottom + window.scrollY + 5}px`,
        left: `${rect.left + window.scrollX}px`,
    };

    return (
        <div ref={popoverRef} style={style} className="absolute z-10 w-48 bg-white rounded-md shadow-lg border border-slate-200 p-2">
            <ul className="space-y-1">
                {Object.values(MealType).map(meal => (
                    <li key={meal}>
                        <button onClick={() => onSelect(meal)} className="w-full text-left px-3 py-1.5 text-sm text-slate-700 rounded-md hover:bg-slate-100 transition-colors">
                            {meal}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const Calendar: React.FC<CalendarProps> = ({ currentDate, selections, weeklyMenu, onDateChange, onSelectMeal }) => {
    const [popoverState, setPopoverState] = useState<{ date: Date, ref: React.RefObject<HTMLDivElement> } | null>(null);
    const dayRefs = useRef<Map<string, React.RefObject<HTMLDivElement>>>(new Map());

    const { monthName, year, daysInMonth } = useMemo(() => {
        const monthName = currentDate.toLocaleString('es-ES', { month: 'long' });
        const year = currentDate.getFullYear();
        
        const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(year, currentDate.getMonth() + 1, 0);

        const days = [];
        // Spanish week starts on Monday (1)
        let startingDayOfWeek = firstDayOfMonth.getDay(); 
        if (startingDayOfWeek === 0) startingDayOfWeek = 7; // Sunday is 0, make it 7

        // Days from previous month
        for (let i = 1; i < startingDayOfWeek; i++) {
            const day = new Date(firstDayOfMonth);
            day.setDate(day.getDate() - (startingDayOfWeek - i));
            days.push(day);
        }

        // Days of current month
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            days.push(new Date(year, currentDate.getMonth(), i));
        }
        
        // Days from next month
        const remainingCells = 42 - days.length; // 6 weeks * 7 days
        for (let i = 1; i <= remainingCells; i++) {
            const day = new Date(lastDayOfMonth);
            day.setDate(day.getDate() + i);
            days.push(day);
        }

        return {
            monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1),
            year,
            daysInMonth: days
        };
    }, [currentDate]);

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
        onDateChange(newDate);
        setPopoverState(null);
    };

    const handleDayClick = (day: Date, isCurrentMonth: boolean) => {
        if (!isCurrentMonth) return;
        
        const dateKey = day.toISOString().split('T')[0];
        let ref = dayRefs.current.get(dateKey);
        if (!ref) {
            ref = React.createRef<HTMLDivElement>();
            dayRefs.current.set(dateKey, ref);
        }

        setPopoverState({ date: day, ref });
    };

    const handleSelectMeal = (mealType: MealType) => {
        if (popoverState) {
            const dateKey = popoverState.date.toISOString().split('T')[0];
            onSelectMeal(dateKey, mealType);
            setPopoverState(null);
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 w-full">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors">
                    <ChevronLeftIcon />
                </button>
                <h2 className="text-xl font-bold text-slate-800 w-48 text-center">{monthName} {year}</h2>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors">
                    <ChevronRightIcon />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-sm text-slate-500 mb-2">
                {WEEKDAYS.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {daysInMonth.map((day, index) => {
                    const dateKey = day.toISOString().split('T')[0];
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isToday = new Date().toDateString() === day.toDateString();
                    
                    let ref = dayRefs.current.get(dateKey);
                    if (!ref) {
                        ref = React.createRef<HTMLDivElement>();
                        dayRefs.current.set(dateKey, ref);
                    }
                    
                    return (
                        <div key={dateKey} ref={ref}>
                          <DayCell
                              day={day}
                              isCurrentMonth={isCurrentMonth}
                              isToday={isToday}
                              selection={selections[dateKey]}
                              menu={weeklyMenu[dateKey]}
                              onClick={() => handleDayClick(day, isCurrentMonth)}
                          />
                        </div>
                    );
                })}
            </div>
            {popoverState && <SelectionPopover targetRef={popoverState.ref} onSelect={handleSelectMeal} onClose={() => setPopoverState(null)} />}
        </div>
    );
};
