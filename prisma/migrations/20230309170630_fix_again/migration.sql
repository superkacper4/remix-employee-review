/*
  Warnings:

  - You are about to drop the column `sheetId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `Sheet` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_sheetId_fkey";

-- DropForeignKey
ALTER TABLE "Sheet" DROP CONSTRAINT "Sheet_userId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "sheetId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Sheet";

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
