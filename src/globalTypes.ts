export type Habit = {
  id: number;
  name: string;
};

export type OldestOccurrences = {
  [habitId: string]: string | null;
};

/**
 * dateString: YYYY-MM-DD
 */
export type OccurrencesByDate = {
  [dateString: string]: {
    [habitId: string]: {
      complete: boolean;
      visible: boolean;
    };
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

/**
 * fullDate: YYYY-MM-DD
 */
export type SelectedOccurrence = {
  date: number;
  fullDate: string;
  complete: boolean;
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

export type ViewType = 'occurrence' | 'list';

export const viewToViewType: { [key in View['name']]: ViewType } = {
  today: 'list',
  yesterday: 'list',
  selection: 'list',
  history: 'occurrence',
  focus: 'occurrence',
};

type DayObject = {
  dateString: string,
  weekDayIndex: number,
  weekDateStrings: string[],
};

export type DateObject = {
  today: DayObject,
  yesterday: DayObject,
  weekDays: string[],
};

export type ModalGenerator = (disableTabIndex: boolean) => JSX.Element;
