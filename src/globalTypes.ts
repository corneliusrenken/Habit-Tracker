export type Habit = {
  id: number;
  name: string;
  streak: number;
  order: number;
};

export type View = 'habit' | 'selection' | 'history' | 'focus';
