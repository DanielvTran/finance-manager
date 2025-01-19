"use client";

import { IncomeContextProvider } from "@/contexts/IncomeContext";
import { CategoryContextProvider } from "@/contexts/CategoriesContext";

export default function IncomesLayout({ children }: { children: React.ReactNode }) {
  return (
    <IncomeContextProvider>
      <CategoryContextProvider>
        <div className="incomes-layout-container">{children}</div>
      </CategoryContextProvider>
    </IncomeContextProvider>
  );
}
