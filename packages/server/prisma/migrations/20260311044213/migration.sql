-- DropForeignKey
ALTER TABLE "result" DROP CONSTRAINT "result_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "suggestion" DROP CONSTRAINT "suggestion_resultId_fkey";

-- AlterTable
ALTER TABLE "assignment" ADD COLUMN     "originalName" TEXT;

-- AlterTable
ALTER TABLE "material" ADD COLUMN     "originalName" TEXT;

-- AlterTable
ALTER TABLE "submission" ADD COLUMN     "originalName" TEXT;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestion" ADD CONSTRAINT "suggestion_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "result"("id") ON DELETE CASCADE ON UPDATE CASCADE;
