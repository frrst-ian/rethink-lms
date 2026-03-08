/*
  Warnings:

  - You are about to drop the column `description` on the `course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course" DROP COLUMN "description",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "section" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "course_code_key" ON "course"("code");
