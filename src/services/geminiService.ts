
import { GoogleGenAI, Type } from "@google/genai";
import type { DinnerSuggestion } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("La clave API de Gemini no está configurada. Por favor, configura la variable de entorno VITE_GEMINI_API_KEY.");
}

const ai = new GoogleGenAI({ apiKey });

const dinnerSuggestionSchema = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            description: "Lista de 2 a 3 sugerencias de cenas.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Nombre del plato de cena." },
                    ingredients: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Lista de ingredientes necesarios."
                    },
                    steps: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Pasos de preparación simples."
                    }
                },
                 required: ['name', 'ingredients', 'steps']
            }
        }
    },
    required: ['suggestions']
};

export const getDinnerSuggestion = async (lunch: string): Promise<DinnerSuggestion[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Basado en un almuerzo de "${lunch}", sugiere 2-3 recetas para la cena que complementen nutricionalmente este almuerzo para un niño. Evita ingredientes repetidos. Las recetas deben ser sencillas, saludables y balanceadas.`,
            config: {
                systemInstruction: "Eres un asistente de nutrición infantil que da sugerencias de cenas en español. Tus respuestas deben ser sencillas, saludables y adecuadas para niños. Responde siempre en formato JSON.",
                responseMimeType: "application/json",
                responseSchema: dinnerSuggestionSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed.suggestions || [];
    } catch (error) {
        console.error("Error fetching dinner suggestions:", error);
        throw new Error("No se pudieron obtener las sugerencias para la cena. Inténtalo de nuevo.");
    }
};
