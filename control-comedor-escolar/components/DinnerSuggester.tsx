
import React, { useState } from 'react';
import { getDinnerSuggestion } from '../services/geminiService.ts';
import type { DinnerSuggestion } from '../types.ts';
import { SparklesIcon } from './Icons.tsx';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></div>
    </div>
);

const SuggestionCard: React.FC<{ suggestion: DinnerSuggestion }> = ({ suggestion }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 transition-shadow hover:shadow-md">
        <h4 className="font-bold text-lg text-slate-800">{suggestion.name}</h4>
        <div className="mt-3">
            <h5 className="font-semibold text-sm text-slate-600">Ingredientes:</h5>
            <ul className="list-disc list-inside mt-1 text-sm text-slate-700 space-y-0.5">
                {suggestion.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>
        </div>
        <div className="mt-3">
            <h5 className="font-semibold text-sm text-slate-600">Pasos:</h5>
            <ol className="list-decimal list-inside mt-1 text-sm text-slate-700 space-y-0.5">
                {suggestion.steps.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
        </div>
    </div>
);

export const DinnerSuggester: React.FC = () => {
    const [lunchInput, setLunchInput] = useState('');
    const [suggestions, setSuggestions] = useState<DinnerSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lunchInput.trim()) {
            setError('Por favor, ingresa qué comió en el almuerzo.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuggestions([]);

        try {
            const result = await getDinnerSuggestion(lunchInput);
            setSuggestions(result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocurrió un error inesperado.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Sugerencia para la Cena</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="lunch" className="block text-sm font-medium text-slate-700 mb-1">
                            ¿Qué comió hoy en el almuerzo?
                        </label>
                        <input
                            id="lunch"
                            type="text"
                            value={lunchInput}
                            onChange={(e) => setLunchInput(e.target.value)}
                            placeholder="Ej: Lentejas con arroz"
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <LoadingSpinner /> : <> <SparklesIcon /> Sugerir Cena </>}
                    </button>
                </form>

                <div className="mt-6">
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    {suggestions.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-800">Aquí tienes algunas ideas:</h3>
                            {suggestions.map((sug, i) => (
                                <SuggestionCard key={i} suggestion={sug} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};