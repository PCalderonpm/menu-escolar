import { MenuData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const getMenu = async (id: string): Promise<MenuData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Menu not found
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching menu:", error);
    return null;
  }
};

export const saveMenu = async (data: MenuData, id?: string): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, data }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.id; // Return the ID of the saved menu
  } catch (error) {
    console.error("Error saving menu:", error);
    return null;
  }
};
