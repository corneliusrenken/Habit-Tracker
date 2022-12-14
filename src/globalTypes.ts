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

export type View = { name: 'today' }
| { name: 'yesterday' }
| { name: 'selection' }
| { name: 'history' }
| { name: 'focus'; focusId: number; };

export type ListView = { name: 'today' }
| { name: 'yesterday' }
| { name: 'selection' };

export type OccurrenceView = { name: 'history' }
| { name: 'focus'; focusId: number; };

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

export type ModalContentGenerator = (allowTabTraversal: boolean) => JSX.Element;
