-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "centerLight" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "colliderLight" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "diningLight" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shadowLight" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "spotLight" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stove1" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stove2" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Command" ADD COLUMN     "centerLight" TEXT NOT NULL DEFAULT 'off',
ADD COLUMN     "colliderLight" TEXT NOT NULL DEFAULT 'off',
ADD COLUMN     "diningLight" TEXT NOT NULL DEFAULT 'off',
ADD COLUMN     "shadowLight" TEXT NOT NULL DEFAULT 'off',
ADD COLUMN     "spotLight" TEXT NOT NULL DEFAULT 'off',
ADD COLUMN     "stove1" TEXT NOT NULL DEFAULT 'off',
ADD COLUMN     "stove2" TEXT NOT NULL DEFAULT 'off';
