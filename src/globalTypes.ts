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

type DateObjectDayInfo = {
  dateString: string,
  weekDateStrings: string[],
  dayIndex: number,
};

export type DateObject = {
  today: DateObjectDayInfo,
  yesterday: DateObjectDayInfo,
  weekDays: string[],
};
