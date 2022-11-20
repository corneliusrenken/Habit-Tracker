export type Habit = {
  id: number;
  name: string;
  done: boolean;
  visible: boolean;
  streak: number;
  order: number;
};

export type Occurrence = {
  date: number;
  complete: boolean;
};

export type View = 'habit' | 'selection' | 'history' | 'focus';

export type ListView = 'habit' | 'selection';
