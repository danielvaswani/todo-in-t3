/*
  Warnings:

  - A unique constraint covering the columns `[order]` on the table `Todo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "order" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Todo_order_key" ON "Todo"("order");
