/*
  Warnings:

  - You are about to drop the `completed_days` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `completed` to the `occurrences` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "completed_days" DROP CONSTRAINT "completed_days_user_id_fkey";

-- AlterTable
ALTER TABLE "occurrences" ADD COLUMN     "completed" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "completed_days";

-- CreateIndex
CREATE INDEX "habits_user_id_idx" ON "habits"("user_id");
