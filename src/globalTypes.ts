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

export type OccurrencesApiData = {
  oldest: {
    [habitId: string]: string | undefined;
  };
  dates: {
    [dateString: string]: {
      [habitId: string]: boolean;
    };
  };
};
