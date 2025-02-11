"use client";

import { ExpenseContextProvider } from "@/contexts/ExpenseContext";
import { CategoryContextProvider } from "@/contexts/CategoriesContext";

export default function ExpensesLayout({ children }: { children: React.ReactNode }) {
  return (
    <ExpenseContextProvider>
      <CategoryContextProvider>
        <div className="expenses-layout-container">{children}</div>
      </CategoryContextProvider>
    </ExpenseContextProvider>
  );
}
