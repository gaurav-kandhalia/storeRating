/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Store_address_key" ON "public"."Store"("address");

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "public"."User"("address");
