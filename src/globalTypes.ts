export type Habit = {
  id: number;
  name: string;
  order: number;
};

export type OldestOccurrences = {
  [habitId: string]: string | null;
};

export type OccurrencesByDate = {
  [dateString: string]: {
    [habitId: string]: boolean;
  };
};

export type OccurrenceData = {
  oldest: OldestOccurrences;
  dates: OccurrencesByDate;
};

export type Streaks = {
  [habitId: string]: {
    current: number;
    maximum: number;
  };
};

export type SelectedOccurrence = {
  date: number;
  done: boolean;
};

export type View = 'habit' | 'selection' | 'history';

export type ListView = 'habit' | 'selection';

export type DayObject = {
  dateString: string,
  weekDayIndex: number,
  weekDateStrings: string[],
  weekDays: string[],
};

export type DateObject = {
  today: DayObject,
  yesterday: DayObject,
};
