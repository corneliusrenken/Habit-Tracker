export type Habit = {
  id: number;
  order: number;
  name: string;
  dayStreak: number;
  complete: boolean;
};

export type HabitWithOffset = Habit & {
  offset: number;
};
