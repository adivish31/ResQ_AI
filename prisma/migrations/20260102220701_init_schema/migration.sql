-- CreateTable
CREATE TABLE "HelpRequest" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL CHECK ("lat" >= -90 AND "lat" <= 90),
    "lng" DOUBLE PRECISION NOT NULL CHECK ("lng" >= -180 AND "lng" <= 180),
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "urgency" INTEGER NOT NULL DEFAULT 1,
    "summary" TEXT NOT NULL DEFAULT 'Incident',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HelpRequest_pkey" PRIMARY KEY ("id")
);
