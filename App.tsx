
import React, { useState, useEffect, useCallback } from 'react';
import type { DaySelection, Prices } from './types.ts';
import { MealType } from './types.ts';
import { Calendar } from './components/Calendar.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { Settings } from './components/Settings.tsx';
import { DinnerSuggester } from './components/DinnerSuggester.tsx';
import { MonthlySummary } from './components/MonthlySummary.tsx';
import { DocumentTextIcon } from './components/Icons.tsx';

// Helper to get initial state from localStorage
const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue);
        }
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
    }
    return defaultValue;
};

const App: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selections, setSelections] = useState<DaySelection>(() => getInitialState<DaySelection>('mealSelections', {}));
    const [prices, setPrices] = useState<Prices>(() => getInitialState<Prices>('mealPrices', { menu: 5, vianda: 3.5, fixed: 120 }));
    const [studentName, setStudentName] = useState<string>(() => getInitialState<string>('studentName', ''));
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);

    // Persist state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('mealSelections', JSON.stringify(selections));
    }, [selections]);

    useEffect(() => {
        localStorage.setItem('mealPrices', JSON.stringify(prices));
    }, [prices]);

    useEffect(() => {
        localStorage.setItem('studentName', JSON.stringify(studentName));
    }, [studentName]);

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
                            onDateChange={handleDateChange}
                            onSelectMeal={handleSelectMeal}
                        />
                         <DinnerSuggester />
                    </div>
                    <div className="space-y-8">
                        <Dashboard selections={selections} prices={prices} currentDate={currentDate} />
                        <Settings 
                          prices={prices} 
                          onPriceChange={handlePriceChange}
                          studentName={studentName}
                          onStudentNameChange={handleStudentNameChange}
                        />
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