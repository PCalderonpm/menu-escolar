
import React, { useMemo } from 'react';
import type { DaySelection, Prices } from '../types';
import { MealType } from '../types';

interface DashboardProps {
    selections: DaySelection;
    prices: Prices;
    currentDate: Date;
}

const StatCard: React.FC<{ title: string; value: string | number; color?: string; description?: string }> = ({ title, value, color = 'text-slate-800', description }) => (
    <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ selections, prices, currentDate }) => {
    const stats = useMemo(() => {
        const monthSelections = Object.entries(selections).filter(([date]) => {
            const d = new Date(date);
            return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
        });

        const menuDays = monthSelections.filter(([, meal]) => meal === MealType.Menu).length;
        const viandaDays = monthSelections.filter(([, meal]) => meal === MealType.Vianda).length;

        const menuCost = menuDays * prices.menu;
        const viandaCost = viandaDays * prices.vianda;
        const totalCost = menuCost + viandaCost;

        const savings = prices.fixed > 0 ? prices.fixed - totalCost : 0;

        return { menuDays, viandaDays, totalCost, savings };
    }, [selections, prices, currentDate]);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Resumen del Mes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard 
                    title="Gasto Acumulado" 
                    value={formatCurrency(stats.totalCost)} 
                    color="text-indigo-600"
                    description={`${stats.menuDays} menús + ${stats.viandaDays} viandas`}
                />
                
                {prices.fixed > 0 && (
                    <>
                        <StatCard 
                            title="Costo Plan Mensual" 
                            value={formatCurrency(prices.fixed)} 
                        />
                        <StatCard 
                            title="Ahorro vs Plan Fijo" 
                            value={formatCurrency(stats.savings)}
                            color={stats.savings >= 0 ? 'text-green-600' : 'text-red-600'}
                            description={stats.savings >= 0 ? "¡Buen trabajo!" : "El plan fijo conviene más"}
                        />
                    </>
                )}
            </div>
        </div>
    );
};
