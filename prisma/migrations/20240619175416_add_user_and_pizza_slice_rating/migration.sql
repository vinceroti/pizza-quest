-- CreateTable
CREATE TABLE "PizzaSliceRating" (
    "id" SERIAL NOT NULL,
    "pizzaPlace" TEXT NOT NULL,
    "overall" DOUBLE PRECISION NOT NULL,
    "crustDough" DOUBLE PRECISION NOT NULL,
    "sauce" DOUBLE PRECISION NOT NULL,
    "toppingToPizzaRatio" DOUBLE PRECISION NOT NULL,
    "creativity" DOUBLE PRECISION NOT NULL,
    "authenticity" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PizzaSliceRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PizzaSliceRating" ADD CONSTRAINT "PizzaSliceRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
