-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PizzaSliceRating" (
    "id" SERIAL NOT NULL,
    "pizzaPlaceId" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "PizzaPlace" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mainText" TEXT NOT NULL,
    "secondaryText" TEXT NOT NULL,

    CONSTRAINT "PizzaPlace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pizzaSliceRatingId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pizzaSliceRatingId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "PizzaSliceRating" ADD CONSTRAINT "PizzaSliceRating_pizzaPlaceId_fkey" FOREIGN KEY ("pizzaPlaceId") REFERENCES "PizzaPlace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PizzaSliceRating" ADD CONSTRAINT "PizzaSliceRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_pizzaSliceRatingId_fkey" FOREIGN KEY ("pizzaSliceRatingId") REFERENCES "PizzaSliceRating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_pizzaSliceRatingId_fkey" FOREIGN KEY ("pizzaSliceRatingId") REFERENCES "PizzaSliceRating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
