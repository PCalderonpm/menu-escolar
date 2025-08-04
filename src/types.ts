
export enum MealType {
  Menu = 'Menú Escolar',
  Vianda = 'Vianda',
  Absent = 'Ausente',
  NoClasses = 'No Hubo Clases',
}

export interface DaySelection {
  [date: string]: MealType;
}

export interface Prices {
  menu: number;
  vianda: number;
  fixed: number;
}

export interface WeeklyMenu {
  [date: string]: string;
}
