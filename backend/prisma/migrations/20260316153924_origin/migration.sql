/*
  Warnings:

  - You are about to drop the `bids` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vehicles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "bids" DROP CONSTRAINT "bids_request_id_fkey";

-- DropForeignKey
ALTER TABLE "bids" DROP CONSTRAINT "bids_workshop_id_fkey";

-- DropForeignKey
ALTER TABLE "service_requests" DROP CONSTRAINT "service_requests_user_id_fkey";

-- DropForeignKey
ALTER TABLE "service_requests" DROP CONSTRAINT "service_requests_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_user_id_fkey";

-- DropTable
DROP TABLE "bids";

-- DropTable
DROP TABLE "service_requests";

-- DropTable
DROP TABLE "vehicles";

-- DropEnum
DROP TYPE "BidStatus";

-- DropEnum
DROP TYPE "ServiceRequestStatus";
