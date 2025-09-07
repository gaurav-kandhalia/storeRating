/*
  Warnings:

  - A unique constraint covering the columns `[userId,storeId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."User_address_key";

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_storeId_key" ON "public"."Rating"("userId", "storeId");
