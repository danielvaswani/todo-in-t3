-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "isComplete" BOOLEAN NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
