/*
  Warnings:

  - You are about to drop the `AnalyticsItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `Analytics` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AnalyticsItem" DROP CONSTRAINT "AnalyticsItem_analyticsId_fkey";

-- DropForeignKey
ALTER TABLE "AnalyticsItem" DROP CONSTRAINT "AnalyticsItem_productId_fkey";

-- DropIndex
DROP INDEX "Analytics_userEmail_key";

-- AlterTable
ALTER TABLE "Analytics" ADD COLUMN     "productId" TEXT NOT NULL;

-- DropTable
DROP TABLE "AnalyticsItem";

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
