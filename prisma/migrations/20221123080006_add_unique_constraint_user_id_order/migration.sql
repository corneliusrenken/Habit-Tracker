/*
  Warnings:

  - A unique constraint covering the columns `[user_id,order]` on the table `habits` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "habits_order_user_id_key";

-- CreateConstraint
ALTER TABLE "habits" ADD CONSTRAINT "unique_order_per_user_id" UNIQUE ("user_id", "order") INITIALLY DEFERRED;
