import { Database } from 'better-sqlite3';

export default function getOccurrencesGroupedByDate(database: Database): {
  [date: string]: {
    [habitId: string]: {
      visible: boolean;
      complete: boolean;
    };
  };
} {
  const getOccurrencesGroupedByDateStmt = database.prepare(`
    WITH occurrences_grouped_by_dates AS (
      SELECT
        date,
        IIF(
          count(habit_id) = 0,
          json_object(),
          (
            SELECT json_group_object(
              habit_id,
              json_object('visible', visible, 'complete', complete)
            )
            FROM occurrences
            WHERE habit_id IS NOT NULL AND occurrences.day_id = d.id
          )
        ) AS habit_ids
      FROM days d
      LEFT JOIN occurrences o
      ON d.id = o.day_id
      GROUP BY date
    )
    SELECT json_group_object(date, json(habit_ids)) as dates
    FROM occurrences_grouped_by_dates
  `);

  const occurrencesGroupedByDate = JSON.parse(getOccurrencesGroupedByDateStmt.get().dates);

  // transform 1 / 0 values into true / false
  const dates = Object.keys(occurrencesGroupedByDate);

  dates.forEach((date) => {
    const habitIds = Object.keys(occurrencesGroupedByDate[date]);

    habitIds.forEach((habitId) => {
      const { visible, complete } = occurrencesGroupedByDate[date][habitId];
      occurrencesGroupedByDate[date][habitId].visible = Boolean(visible);
      occurrencesGroupedByDate[date][habitId].complete = Boolean(complete);
    });
  });

  return occurrencesGroupedByDate;
}
