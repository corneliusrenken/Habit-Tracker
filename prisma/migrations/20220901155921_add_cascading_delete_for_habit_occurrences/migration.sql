-- DropForeignKey
ALTER TABLE "occurrences" DROP CONSTRAINT "occurrences_habit_id_fkey";

-- AddForeignKey
ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
