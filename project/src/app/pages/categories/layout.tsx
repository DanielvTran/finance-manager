"use client";

import { CategoryContextProvider } from "@/contexts/CategoriesContext";

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return (
    <CategoryContextProvider>
      <div className="categories-layout-container">{children}</div>
    </CategoryContextProvider>
  );
}
