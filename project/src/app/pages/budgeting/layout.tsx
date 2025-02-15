"use client";

import { BudgetContextProvider } from "@/contexts/BudgetContext";
import { CategoryContextProvider } from "@/contexts/CategoriesContext";

export default function BudgetsLayout({ children }: { children: React.ReactNode }) {
  return (
    <BudgetContextProvider>
      <CategoryContextProvider>
        <div className="expenses-layout-container">{children}</div>
      </CategoryContextProvider>
    </BudgetContextProvider>
  );
}
