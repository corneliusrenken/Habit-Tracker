import { Database } from 'better-sqlite3';

export default function getOccurrencesGroupedByDate(database: Database): {
  [date: string]: {
    [habitId: string]: {
      visible: 1 | 0;
      complete: 1 | 0;
    };
  };
} {
  const getOccurrencesGroupedByDateStmt = database.prepare(`
    WITH occurrences_grouped_by_dates AS (
      SELECT date, json_group_object(habit_id, json_object('visible', visible, 'complete', complete)) AS habit_ids
      FROM occurrences
      LEFT JOIN days
      ON days.id = occurrences.day_id
      GROUP BY date
    )
    SELECT json_group_object(date, json(habit_ids)) as dates
    FROM occurrences_grouped_by_dates
  `);

  return JSON.parse(getOccurrencesGroupedByDateStmt.get().dates);
}
