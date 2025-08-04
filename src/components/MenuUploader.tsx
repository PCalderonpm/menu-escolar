
import React, { useState } from 'react';

interface MenuUploaderProps {
    onAddMenu: (date: string, menu: string) => void;
}

export const MenuUploader: React.FC<MenuUploaderProps> = ({ onAddMenu }) => {
    const [date, setDate] = useState('');
    const [menu, setMenu] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (date && menu) {
            onAddMenu(date, menu);
            setDate('');
            setMenu('');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cargar Menú Semanal</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="menu-date" className="block text-sm font-medium text-gray-700">Fecha</label>
                    <input
                        type="date"
                        id="menu-date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="menu-description" className="block text-sm font-medium text-gray-700">Menú</label>
                    <textarea
                        id="menu-description"
                        rows={3}
                        value={menu}
                        onChange={(e) => setMenu(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Ej: Lentejas con arroz y ensalada"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Añadir Menú
                </button>
            </form>
        </div>
    );
};
