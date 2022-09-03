export type Habit = {
  id: number;
  name: string;
  order: number;
  selected: boolean;
};

export type HabitWithComplete = Habit & {
  complete: boolean;
};

export type HabitWithOffset = HabitWithComplete & {
  offset: number;
};

export type Occurrences = {
  [key: string]: Array<number>;
};

export type CompletedDays = {
  completed: { [key: string]: boolean };
  oldest: string | null;
};

export type Theme = {
  primary: string;
  secondary: string;
  tertiary: string;
  background: string;
};

export type DateInfo = {
  today: Date,
  todayString: string,
  yesterday: Date,
  yesterdayString: string,
  weekDates: Array<Date>,
  weekDays: Array<string>,
  todaysIndex: number,
};
