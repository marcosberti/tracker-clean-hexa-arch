-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Installments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" DECIMAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "installments" INTEGER NOT NULL,
    "paidInstallments" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "firstPaymentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountId" TEXT NOT NULL,
    "currencyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "Installments_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Accounts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Installments_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currencies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Installments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Installments_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Installments" ("accountId", "active", "amount", "categoryId", "currencyId", "description", "firstPaymentDate", "id", "installments", "paidInstallments", "title", "userId") SELECT "accountId", "active", "amount", "categoryId", "currencyId", "description", "firstPaymentDate", "id", "installments", "paidInstallments", "title", "userId" FROM "Installments";
DROP TABLE "Installments";
ALTER TABLE "new_Installments" RENAME TO "Installments";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
