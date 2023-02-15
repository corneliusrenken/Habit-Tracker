import { Database } from 'better-sqlite3';

type UpdateData = ({
  visible: boolean;
}) | ({
  complete: boolean;
});

/**
 * @param date "YYYY-MM-DD"
 */
export default function updateOccurrence(
  database: Database,
  options: { habitId: number, date: string, updateData: UpdateData },
) {
  const { habitId, date, updateData } = options;

  const getOccurrenceStmt = database.prepare(`
    SELECT occurrences.id, visible, complete
    FROM occurrences
    LEFT JOIN days
    ON days.id = occurrences.day_id
    WHERE habit_id = ? AND date = ?
  `);

  const occurrencePreUpdate: {
    id: number;
    visible: 1 | 0;
    complete: 1 | 0;
  } | undefined = getOccurrenceStmt.get(habitId, date);

  if (occurrencePreUpdate === undefined) {
    throw new Error('Error: No occurrence matches the given habit id / date');
  }

  if (('visible' in updateData && occurrencePreUpdate.visible === Number(updateData.visible))
  || ('complete' in updateData && occurrencePreUpdate.complete === Number(updateData.complete))) {
    return;
  }

  const updateStmt = 'visible' in updateData
    ? database.prepare('UPDATE occurrences SET visible = ? WHERE id = ?')
    : database.prepare('UPDATE occurrences SET complete = ? WHERE id = ?');

  const updateValue = 'visible' in updateData
    ? Number(updateData.visible)
    : Number(updateData.complete);

  updateStmt.run(updateValue, occurrencePreUpdate?.id);
}
