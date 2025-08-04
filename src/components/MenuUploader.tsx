import React, { useState } from 'react';

interface MenuUploaderProps {
    onAddMenu: (date: string, menu: string) => void;
    onCopyWeekMenu: (weekNumber: 1 | 2) => void;
}

export const MenuUploader: React.FC<MenuUploaderProps> = ({ onAddMenu, onCopyWeekMenu }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [menu, setMenu] = useState('');

    const handleAdd = () => {
        if (date && menu) {
            onAddMenu(date, menu);
            setMenu('');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Cargar Menú Diario</h3>
            <div className="space-y-2">
                <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <input 
                    type="text" 
                    placeholder="Descripción del menú..."
                    value={menu} 
                    onChange={(e) => setMenu(e.target.value)} 
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <button onClick={handleAdd} className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Añadir Menú
            </button>
            <div className="flex gap-2">
                <button onClick={() => onCopyWeekMenu(1)} className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Copiar Semana 1
                </button>
                <button onClick={() => onCopyWeekMenu(2)} className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Copiar Semana 2
                </button>
            </div>
        </div>
    );
};