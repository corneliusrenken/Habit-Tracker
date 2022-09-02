export type Habit = {
  id: number;
  name: string;
  order: number;
  selected: boolean;
};

export type HabitWithComplete = Habit & {
  complete: boolean,
};

export type HabitWithOffset = HabitWithComplete & {
  offset: number;
};

export type Occurrences = {
  [key: string]: Array<number>;
};
