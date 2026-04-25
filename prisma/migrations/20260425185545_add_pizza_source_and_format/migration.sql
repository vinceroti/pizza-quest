-- CreateEnum
CREATE TYPE "PizzaSource" AS ENUM ('HOMEMADE', 'PURCHASED');

-- CreateEnum
CREATE TYPE "PizzaFormat" AS ENUM ('SLICE', 'WHOLE_PIE');

-- AlterTable
ALTER TABLE "PizzaSliceRating" ADD COLUMN     "format" "PizzaFormat" NOT NULL DEFAULT 'SLICE',
ADD COLUMN     "source" "PizzaSource" NOT NULL DEFAULT 'PURCHASED';
