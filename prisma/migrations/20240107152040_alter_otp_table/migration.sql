/*
  Warnings:

  - A unique constraint covering the columns `[user_id,code]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Otp_user_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Otp_user_id_code_key" ON "Otp"("user_id", "code");
