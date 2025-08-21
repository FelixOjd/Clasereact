// Simulación de una base de datos para los ganadores (esto podría ser una API real)
export const WINNERS_KEY = 'examWinners';

export interface Winner {
  name: string;
  completedTasks: number;
  timestamp: number;
}

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  user: string;
}