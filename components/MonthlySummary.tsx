
import React, { useMemo } from 'react';
import type { DaySelection, Prices } from '../types.ts';
import { MealType } from '../types.ts';
import { XMarkIcon, DocumentTextIcon } from './Icons.tsx';

interface MonthlySummaryProps {
    isOpen: boolean;
    onClose: () => void;
    selections: DaySelection;
    prices: Prices;
    studentName: string;
    currentDate: Date;
}

export const MonthlySummary: React.FC<MonthlySummaryProps> = ({ isOpen, onClose, selections, prices, studentName, currentDate }) => {
    
    const stats = useMemo(() => {
        const monthSelections = Object.entries(selections).filter(([date]) => {
            const d = new Date(date);
            return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
        });

        const menuDays = monthSelections.filter(([, meal]) => meal === MealType.Menu).length;
        const viandaDays = monthSelections.filter(([, meal]) => meal === MealType.Vianda).length;
        const absentDays = monthSelections.filter(([, meal]) => meal === MealType.Absent).length;
        const noClassesDays = monthSelections.filter(([, meal]) => meal === MealType.NoClasses).length;
        
        const menuCost = menuDays * prices.menu;
        const viandaCost = viandaDays * prices.vianda;
        const totalCost = menuCost + viandaCost;
        
        return { menuDays, viandaDays, absentDays, noClassesDays, menuCost, viandaCost, totalCost };
    }, [selections, prices, currentDate]);

    if (!isOpen) return null;

    const formatCurrency = (value: number) => {
        return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    };
    
    const monthName = currentDate.toLocaleString('es-ES', { month: 'long' });
    const year = currentDate.getFullYear();

    const handlePrint = () => {
        window.print();
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <style>
                {`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #print-section, #print-section * {
                        visibility: visible;
                    }
                    #print-section {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none;
                    }
                }
                `}
            </style>
            <div id="print-section" className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="no-print absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors">
                    <XMarkIcon className="w-7 h-7" />
                </button>
                
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-slate-900">Resumen del Mes</h2>
                    <p className="text-slate-600 text-lg">{monthName.charAt(0).toUpperCase() + monthName.slice(1)} {year}</p>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-slate-800">Alumno/a: <span className="font-bold">{studentName || 'No especificado'}</span></h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-8">
                    <div className="bg-green-100 p-3 rounded-lg"><span className="font-bold text-green-800 text-2xl">{stats.menuDays}</span><p className="text-sm text-green-700">Menús</p></div>
                    <div className="bg-blue-100 p-3 rounded-lg"><span className="font-bold text-blue-800 text-2xl">{stats.viandaDays}</span><p className="text-sm text-blue-700">Viandas</p></div>
                    <div className="bg-slate-200 p-3 rounded-lg"><span className="font-bold text-slate-800 text-2xl">{stats.absentDays}</span><p className="text-sm text-slate-700">Ausencias</p></div>
                    <div className="bg-amber-100 p-3 rounded-lg"><span className="font-bold text-amber-800 text-2xl">{stats.noClassesDays}</span><p className="text-sm text-amber-700">Sin Clases</p></div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Desglose de Cargos</h3>
                    <div className="space-y-3 text-slate-700">
                        <div className="flex justify-between items-center">
                            <p>Costo por Menús Escolares:</p>
                            <p className="font-medium">{stats.menuDays} días × {formatCurrency(prices.menu)} = <span className="font-bold">{formatCurrency(stats.menuCost)}</span></p>
                        </div>
                         <div className="flex justify-between items-center">
                            <p>Costo por Viandas:</p>
                            <p className="font-medium">{stats.viandaDays} días × {formatCurrency(prices.vianda)} = <span className="font-bold">{formatCurrency(stats.viandaCost)}</span></p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-300 mt-6 pt-4">
                    <div className="flex justify-between items-center text-2xl font-bold text-slate-900">
                        <p>TOTAL A PAGAR:</p>
                        <p className="text-indigo-600">{formatCurrency(stats.totalCost)}</p>
                    </div>
                </div>

                <div className="mt-8 text-center no-print">
                     <button 
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <DocumentTextIcon />
                        Imprimir o Guardar PDF
                    </button>
                </div>

            </div>
        </div>
    );
};