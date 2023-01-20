-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habits" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "selected" BOOLEAN NOT NULL,
    "order" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "streak_id" INTEGER NOT NULL,

    CONSTRAINT "habits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "occurrences" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "habit_id" INTEGER NOT NULL,

    CONSTRAINT "occurrences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "streaks" (
    "id" SERIAL NOT NULL,
    "min" INTEGER NOT NULL DEFAULT 0,
    "max" INTEGER NOT NULL DEFAULT 0,
    "current" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "streaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "completed_days" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "completed_days_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "habits_streak_id_key" ON "habits"("streak_id");

-- CreateIndex
CREATE INDEX "habits_user_id_streak_id_idx" ON "habits"("user_id", "streak_id");

-- CreateIndex
CREATE UNIQUE INDEX "habits_order_user_id_key" ON "habits"("order", "user_id");

-- CreateIndex
CREATE INDEX "occurrences_habit_id_idx" ON "occurrences"("habit_id");

-- CreateIndex
CREATE UNIQUE INDEX "occurrences_date_habit_id_key" ON "occurrences"("date", "habit_id");

-- CreateIndex
CREATE INDEX "completed_days_user_id_idx" ON "completed_days"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "completed_days_date_user_id_key" ON "completed_days"("date", "user_id");

-- AddForeignKey
ALTER TABLE "habits" ADD CONSTRAINT "habits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habits" ADD CONSTRAINT "habits_streak_id_fkey" FOREIGN KEY ("streak_id") REFERENCES "streaks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completed_days" ADD CONSTRAINT "completed_days_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
