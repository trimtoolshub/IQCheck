-- CreateTable
CREATE TABLE "AdView" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testSessionId" TEXT NOT NULL,
    "adProvider" TEXT NOT NULL,
    "revenueCents" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdView_testSessionId_fkey" FOREIGN KEY ("testSessionId") REFERENCES "TestSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Share" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testSessionId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "sharedWith" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Share_testSessionId_fkey" FOREIGN KEY ("testSessionId") REFERENCES "TestSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "testSessionId" TEXT,
    "source" TEXT NOT NULL,
    "subscribed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Email_testSessionId_fkey" FOREIGN KEY ("testSessionId") REFERENCES "TestSession" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TestSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "countryCode" TEXT,
    "currency" TEXT,
    "priceCents" INTEGER,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "unlocked" BOOLEAN NOT NULL DEFAULT false,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "adViews" INTEGER NOT NULL DEFAULT 0,
    "scoreIQ" INTEGER,
    "scoreOCD" INTEGER,
    "engineState" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "TestSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TestSession" ("completedAt", "countryCode", "currency", "engineState", "id", "paid", "priceCents", "scoreIQ", "scoreOCD", "startedAt", "status", "userId") SELECT "completedAt", "countryCode", "currency", "engineState", "id", "paid", "priceCents", "scoreIQ", "scoreOCD", "startedAt", "status", "userId" FROM "TestSession";
DROP TABLE "TestSession";
ALTER TABLE "new_TestSession" RENAME TO "TestSession";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Email_email_key" ON "Email"("email");
