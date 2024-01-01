/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Staff" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "contact_info" TEXT NOT NULL,
    "cnic_number" TEXT,
    "avatar" TEXT,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "account_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "admin_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
