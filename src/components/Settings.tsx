
import React from 'react';
import type { Prices } from '../types';

interface SettingsProps {
    prices: Prices;
    onPriceChange: (newPrices: Prices) => void;
    studentName: string;
    onStudentNameChange: (name: string) => void;
}

const InputField: React.FC<{ label: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; prefix?: string }> = ({ label, value, onChange, type = "text", prefix }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <div className="relative rounded-md shadow-sm">
            {prefix && <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 sm:text-sm">{prefix}</span>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                className={`block w-full rounded-md border-slate-300 ${prefix ? 'pl-7' : 'pl-3'} pr-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
        </div>
    </div>
);

export const Settings: React.FC<SettingsProps> = ({ prices, onPriceChange, studentName, onStudentNameChange }) => {
    
    const handlePriceChange = (field: keyof Prices, value: string) => {
        const numValue = parseFloat(value) || 0;
        onPriceChange({ ...prices, [field]: numValue });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Configuración</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-4">
                 <InputField
                    label="Nombre del Alumno/a"
                    value={studentName}
                    onChange={(e) => onStudentNameChange(e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <InputField
                        label="Valor Menú Diario"
                        value={prices.menu}
                        onChange={(e) => handlePriceChange('menu', e.target.value)}
                        type="number"
                        prefix="$"
                    />
                    <InputField
                        label="Valor Vianda"
                        value={prices.vianda}
                        onChange={(e) => handlePriceChange('vianda', e.target.value)}
                        type="number"
                        prefix="$"
                    />
                </div>
                <InputField
                    label="Costo Menú Mensual Fijo"
                    value={prices.fixed}
                    onChange={(e) => handlePriceChange('fixed', e.target.value)}
                    type="number"
                    prefix="$"
                />
            </div>
        </div>
    );
};
