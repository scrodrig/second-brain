-- CreateEnum
CREATE TYPE "Concept" AS ENUM ('Meal', 'Technology', 'Internet', 'Electricity', 'Education', 'Transportation', 'Others');

-- CreateEnum
CREATE TYPE "Account" AS ENUM ('Personal', 'Business');

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "place" TEXT NOT NULL,
    "NIF" TEXT NOT NULL,
    "concept" "Concept",
    "description" TEXT,
    "owner" TEXT NOT NULL,
    "account" "Account" NOT NULL,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isReembursable" BOOLEAN NOT NULL DEFAULT false,
    "isRefunded" BOOLEAN NOT NULL DEFAULT false,
    "vatRefund" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);
