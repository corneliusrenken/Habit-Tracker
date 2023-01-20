/*
  Warnings:

  - You are about to drop the column `streak_id` on the `habits` table. All the data in the column will be lost.
  - You are about to drop the `streaks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "habits" DROP CONSTRAINT "habits_streak_id_fkey";

-- DropIndex
DROP INDEX "habits_streak_id_key";

-- DropIndex
DROP INDEX "habits_user_id_streak_id_idx";

-- AlterTable
ALTER TABLE "habits" DROP COLUMN "streak_id";

-- DropTable
DROP TABLE "streaks";
