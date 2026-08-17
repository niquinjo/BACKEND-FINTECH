-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatarUrl" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
