/*
  Warnings:

  - A unique constraint covering the columns `[pos]` on the table `Todo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Todo_pos_key" ON "Todo"("pos");
