-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "balance" DECIMAL NOT NULL DEFAULT 0,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "main" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currencyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Accounts_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Accounts" ("balance", "color", "createdAt", "currencyId", "icon", "id", "main", "name", "updatedAt", "userId") SELECT "balance", "color", "createdAt", "currencyId", "icon", "id", "main", "name", "updatedAt", "userId" FROM "Accounts";
DROP TABLE "Accounts";
ALTER TABLE "new_Accounts" RENAME TO "Accounts";
CREATE UNIQUE INDEX "Accounts_name_key" ON "Accounts"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
