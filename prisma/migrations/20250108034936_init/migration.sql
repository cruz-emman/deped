-- CreateEnum
CREATE TYPE "Role" AS ENUM ('super_admin', 'division_office_admin', 'division_office', 'school_admin', 'teacher');

-- CreateEnum
CREATE TYPE "Affiliation" AS ENUM ('super_admin', 'division_office', 'school');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'suspend', 'retired', 'transfered');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'teacher',
    "affiliation" "Affiliation" NOT NULL DEFAULT 'school',
    "status" "Status" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "first_name" TEXT,
    "middle_name" TEXT,
    "last_name" TEXT,
    "suffix" TEXT,
    "sex" TEXT,
    "email" TEXT,
    "position" TEXT,
    "position_other" TEXT,
    "classification" TEXT,
    "years_in_service" TEXT,
    "section_or_unit" TEXT,
    "undergraduate_course" TEXT,
    "date_graduated" TEXT,
    "doctorate_degree" TEXT,
    "master_degree" TEXT,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "school" TEXT,
    "division_office" TEXT,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificates" (
    "id" TEXT NOT NULL,
    "training_title" TEXT NOT NULL,
    "training_year" TEXT NOT NULL,
    "training_from" TEXT NOT NULL,
    "training_to" TEXT NOT NULL,
    "training_number_of_hours" TEXT NOT NULL,
    "training_sponsored_by" TEXT NOT NULL,
    "training_name_of_provider" TEXT NOT NULL,
    "training_category" TEXT,
    "training_international" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Certificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_accountId_key" ON "Account"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificates" ADD CONSTRAINT "Certificates_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
