-- CreateTable
CREATE TABLE "CustomerSideData" (
    "id" SERIAL NOT NULL,
    "marqueeText" TEXT NOT NULL,
    "extraNote" TEXT,
    "additionalText1" TEXT,
    "additionalText2" TEXT,
    "additionalText3" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerSideData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerSideImage" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerSideImage_pkey" PRIMARY KEY ("id")
);
