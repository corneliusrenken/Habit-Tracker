export type Habit = {
  id: number;
  name: string;
  order: number;
};

export type OccurrenceData = {
  oldest: {
    [habitId: string]: string | null;
  };
  dates: {
    [dateString: string]: {
      [habitId: string]: boolean;
    };
  };
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

export type View = 'habit' | 'selection' | 'history' | 'focus';

export type ListView = 'habit' | 'selection';

export type DayObject = {
  date: string,
  weekDayIndex: number,
  weekDateStrings: string[],
  weekDays: string[],
};

export type DateObject = {
  today: DayObject,
  yesterday: DayObject,
};
