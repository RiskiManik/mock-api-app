-- CreateEnum
CREATE TYPE "METHOD" AS ENUM ('POST', 'GET', 'PATCH', 'PUT');

-- CreateTable
CREATE TABLE "MockApi" (
    "id" TEXT NOT NULL,
    "method" "METHOD" NOT NULL,
    "endpoint" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "requestId" TEXT,
    "responseId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MockApi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "headers" JSONB NOT NULL,
    "body" JSONB NOT NULL,
    "queryParams" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "headers" JSONB NOT NULL,
    "body" JSONB NOT NULL,
    "status" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MockApi_subdomain_key" ON "MockApi"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "MockApi_requestId_key" ON "MockApi"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "MockApi_responseId_key" ON "MockApi"("responseId");

-- AddForeignKey
ALTER TABLE "MockApi" ADD CONSTRAINT "MockApi_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockApi" ADD CONSTRAINT "MockApi_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE SET NULL ON UPDATE CASCADE;
