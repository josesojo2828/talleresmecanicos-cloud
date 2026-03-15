/*
  Warnings:

  - The values [USER,COMPLIANCE] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `deleted_at` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `cities` table. All the data in the column will be lost.
  - You are about to drop the column `state_id` on the `cities` table. All the data in the column will be lost.
  - You are about to drop the column `currency_id` on the `countries` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `countries` table. All the data in the column will be lost.
  - You are about to drop the column `languaje` on the `countries` table. All the data in the column will be lost.
  - You are about to drop the column `region_id` on the `countries` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `countries` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `devices` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `birth_date` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `kyc_level` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `languaje` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `permission_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `referral_code` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `referred_by_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `total_points` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `two_factor_enabled` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `addresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bank_accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `crypto_wallets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `currencies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `regions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `states` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscription_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,country_id]` on the table `cities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `countries` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `country_id` to the `cities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'SUPPORT', 'TALLER', 'CLIENT');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CLIENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "bank_accounts" DROP CONSTRAINT "bank_accounts_currency_id_fkey";

-- DropForeignKey
ALTER TABLE "bank_accounts" DROP CONSTRAINT "bank_accounts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "cities" DROP CONSTRAINT "cities_state_id_fkey";

-- DropForeignKey
ALTER TABLE "countries" DROP CONSTRAINT "countries_currency_id_fkey";

-- DropForeignKey
ALTER TABLE "countries" DROP CONSTRAINT "countries_region_id_fkey";

-- DropForeignKey
ALTER TABLE "crypto_wallets" DROP CONSTRAINT "crypto_wallets_currency_id_fkey";

-- DropForeignKey
ALTER TABLE "crypto_wallets" DROP CONSTRAINT "crypto_wallets_user_id_fkey";

-- DropForeignKey
ALTER TABLE "states" DROP CONSTRAINT "states_country_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_currency_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_receiver_account_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_sender_account_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_referred_by_id_fkey";

-- DropIndex
DROP INDEX "users_email_status_idx";

-- DropIndex
DROP INDEX "users_referral_code_idx";

-- DropIndex
DROP INDEX "users_referral_code_key";

-- DropIndex
DROP INDEX "users_token_key";

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "cities" DROP COLUMN "deleted_at",
DROP COLUMN "state_id",
ADD COLUMN     "country_id" TEXT NOT NULL,
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "countries" DROP COLUMN "currency_id",
DROP COLUMN "deleted_at",
DROP COLUMN "languaje",
DROP COLUMN "region_id",
DROP COLUMN "timezone",
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "devices" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "deleted_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "birth_date",
DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "deleted_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "kyc_level",
DROP COLUMN "languaje",
DROP COLUMN "permission_id",
DROP COLUMN "referral_code",
DROP COLUMN "referred_by_id",
DROP COLUMN "status",
DROP COLUMN "token",
DROP COLUMN "total_points",
DROP COLUMN "two_factor_enabled",
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "role" SET DEFAULT 'CLIENT';

-- DropTable
DROP TABLE "addresses";

-- DropTable
DROP TABLE "bank_accounts";

-- DropTable
DROP TABLE "crypto_wallets";

-- DropTable
DROP TABLE "currencies";

-- DropTable
DROP TABLE "permissions";

-- DropTable
DROP TABLE "regions";

-- DropTable
DROP TABLE "states";

-- DropTable
DROP TABLE "subscription_plans";

-- DropTable
DROP TABLE "subscriptions";

-- DropTable
DROP TABLE "transactions";

-- DropEnum
DROP TYPE "AccountStatus";

-- DropEnum
DROP TYPE "InvestmentStatus";

-- DropEnum
DROP TYPE "KYCLevel";

-- DropEnum
DROP TYPE "Network";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- DropEnum
DROP TYPE "TransactionStatus";

-- DropEnum
DROP TYPE "TransactionType";

-- DropEnum
DROP TYPE "UserStatus";

-- CreateTable
CREATE TABLE "support_assignments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "country_id" TEXT,
    "city_id" TEXT,

    CONSTRAINT "support_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workshop_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "workshop_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workshops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "website" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "logo_url" TEXT,
    "images" TEXT[],
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "opening_hours" TEXT,
    "social_media" JSONB,
    "user_id" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "workshops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publications" (
    "id" TEXT NOT NULL,
    "workshop_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" TEXT[],
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "publications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" TEXT[],
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT NOT NULL,
    "workshop_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "forum_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "forum_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_likes" (
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "forum_likes_pkey" PRIMARY KEY ("user_id","post_id")
);

-- CreateTable
CREATE TABLE "forum_favorites" (
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "forum_favorites_pkey" PRIMARY KEY ("user_id","post_id")
);

-- CreateTable
CREATE TABLE "_WorkshopToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WorkshopToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "workshop_categories_name_key" ON "workshop_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "workshops_user_id_key" ON "workshops"("user_id");

-- CreateIndex
CREATE INDEX "_WorkshopToCategory_B_index" ON "_WorkshopToCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_country_id_key" ON "cities"("name", "country_id");

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_assignments" ADD CONSTRAINT "support_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_assignments" ADD CONSTRAINT "support_assignments_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_assignments" ADD CONSTRAINT "support_assignments_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshops" ADD CONSTRAINT "workshops_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshops" ADD CONSTRAINT "workshops_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workshops" ADD CONSTRAINT "workshops_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_workshop_id_fkey" FOREIGN KEY ("workshop_id") REFERENCES "workshops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_workshop_id_fkey" FOREIGN KEY ("workshop_id") REFERENCES "workshops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_comments" ADD CONSTRAINT "forum_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "forum_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_comments" ADD CONSTRAINT "forum_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_likes" ADD CONSTRAINT "forum_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_likes" ADD CONSTRAINT "forum_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "forum_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_favorites" ADD CONSTRAINT "forum_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_favorites" ADD CONSTRAINT "forum_favorites_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "forum_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkshopToCategory" ADD CONSTRAINT "_WorkshopToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "workshops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkshopToCategory" ADD CONSTRAINT "_WorkshopToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "workshop_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
