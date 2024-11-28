"use client";

import { IncomeContextProvider } from "@/contexts/IncomeContext";

export default function IncomesLayout({ children }: { children: React.ReactNode }) {
  return (
    <IncomeContextProvider>
      <div className="incomes-layout-container">{children}</div>
    </IncomeContextProvider>
  );
}
