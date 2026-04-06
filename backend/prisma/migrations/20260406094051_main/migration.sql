-- AlterTable
ALTER TABLE "parts" ADD COLUMN     "currency" TEXT DEFAULT 'USD';

-- AlterTable
ALTER TABLE "works" ADD COLUMN     "currency" TEXT DEFAULT 'USD';
