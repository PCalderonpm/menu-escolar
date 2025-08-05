import React, { useState, useEffect, useCallback } from 'react';
import type { DaySelection, Prices, WeeklyMenu, MenuData } from './types';
import { MealType } from './types';
import { Calendar } from './components/Calendar';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { MonthlySummary } from './components/MonthlySummary';
import { WeeklyMenuDisplay } from './components/WeeklyMenuDisplay';
import { DocumentTextIcon } from './components/Icons';
import { getMenu, saveMenu } from './services/api';
import { nanoid } from 'nanoid';

const App: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selections, setSelections] = useState<DaySelection>({});
    const [prices, setPrices] = useState<Prices>({ menu: 5, vianda: 3.5, fixed: 120 });
    const [studentName, setStudentName] = useState<string>('');
    const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu>({});
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    const [menuId, setMenuId] = useState<string | null>(null);

    // Load data from API on initial render
    useEffect(() => {
        const loadMenu = async () => {
            // Try to get menuId from URL or localStorage
            const urlParams = new URLSearchParams(window.location.search);
            let id = urlParams.get('id');

            if (!id) {
                id = localStorage.getItem('menuId');
            }

            if (id) {
                const data = await getMenu(id);
                if (data) {
                    setSelections(data.selections || {});
                    setPrices(data.prices || { menu: 5, vianda: 3.5, fixed: 120 });
                    setStudentName(data.studentName || '');
                    setWeeklyMenu(data.weeklyMenu || {});
                    setMenuId(id);
                } else {
                    // If ID exists but menu not found, generate new ID
                    const newId = nanoid(10);
                    setMenuId(newId);
                    localStorage.setItem('menuId', newId);
                    window.history.replaceState({}, '', `?id=${newId}`);
                }
            } else {
                // No ID found, generate a new one
                const newId = nanoid(10);
                setMenuId(newId);
                localStorage.setItem('menuId', newId);
                window.history.replaceState({}, '', `?id=${newId}`);
            }
        };
        loadMenu();
    }, []);

    // Save data to API whenever relevant state changes
    useEffect(() => {
        if (menuId) {
            const dataToSave: MenuData = {
                selections,
                prices,
                studentName,
                weeklyMenu,
            };
            saveMenu(dataToSave, menuId);
        }
    }, [selections, prices, studentName, weeklyMenu, menuId]);

    const handleSelectMeal = useCallback((date: string, mealType: MealType) => {
        setSelections(prev => {
            const newSelections = { ...prev };
            if (prev[date] === mealType) {
                delete newSelections[date];
            } else {
                newSelections[date] = mealType;
            }
            return newSelections;
        });
    }, []);

    const handlePriceChange = useCallback((newPrices: Prices) => {
        setPrices(newPrices);
    }, []);
    
    const handleStudentNameChange = useCallback((name: string) => {
        setStudentName(name);
    }, []);

    const handleDateChange = useCallback((date: Date) => {
        setCurrentDate(date);
    }, []);

    const handleAddMenu = useCallback((date: string, menu: string) => {
        setWeeklyMenu(prev => ({
            ...prev,
            [date]: menu
        }));
    }, []);

    const handleRepeatWeeks = useCallback(() => {
        setWeeklyMenu(prev => {
            const newWeeklyMenu = { ...prev };
            const startOfWeek1 = new Date(currentDate);
            startOfWeek1.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));
            const startOfWeek2 = new Date(startOfWeek1);
            startOfWeek2.setDate(startOfWeek1.getDate() + 7);

            for (let i = 0; i < 5; i++) {
                const date1 = new Date(startOfWeek1);
                date1.setDate(startOfWeek1.getDate() + i);
                const date1Key = date1.toISOString().split('T')[0];

                const date3 = new Date(date1);
                date3.setDate(date1.getDate() + 14);
                const date3Key = date3.toISOString().split('T')[0];

                if (newWeeklyMenu[date1Key]) {
                    newWeeklyMenu[date3Key] = newWeeklyMenu[date1Key];
                }

                const date2 = new Date(startOfWeek2);
                date2.setDate(startOfWeek2.getDate() + i);
                const date2Key = date2.toISOString().split('T')[0];

                const date4 = new Date(date2);
                date4.setDate(date2.getDate() + 14);
                const date4Key = date4.toISOString().split('T')[0];

                if (newWeeklyMenu[date2Key]) {
                    newWeeklyMenu[date4Key] = newWeeklyMenu[date2Key];
                }
            }
            return newWeeklyMenu;
        });
    }, [currentDate]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-indigo-600">Control Comedor Escolar</h1>
                    <button 
                        onClick={() => setIsSummaryOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <DocumentTextIcon />
                        Generar Resumen
                    </button>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Calendar
                            currentDate={currentDate}
                            selections={selections}
                            weeklyMenu={weeklyMenu}
                            onDateChange={handleDateChange}
                            onSelectMeal={handleSelectMeal}
                        />
                        <WeeklyMenuDisplay 
                            weeklyMenu={weeklyMenu} 
                            currentDate={currentDate} 
                            onAddMenu={handleAddMenu} 
                            onRepeatWeeks={handleRepeatWeeks}
                        />
                    </div>
                    <div className="space-y-8">
                        <Settings 
                          prices={prices} 
                          onPriceChange={handlePriceChange}
                          studentName={studentName}
                          onStudentNameChange={handleStudentNameChange}
                        />
                        <Dashboard selections={selections} prices={prices} currentDate={currentDate} />
                    </div>
                </div>
            </main>
            
            <footer className="text-center py-6 text-sm text-slate-500">
                <p>&copy; {new Date().getFullYear()} Control Comedor Escolar. Hecho con ❤️ para padres organizados.</p>
            </footer>

            <MonthlySummary 
                isOpen={isSummaryOpen}
                onClose={() => setIsSummaryOpen(false)}
                selections={selections}
                prices={prices}
                studentName={studentName}
                currentDate={currentDate}
            />
        </div>
    );
};

export default App;