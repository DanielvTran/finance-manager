"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Category } from "@prisma/client";

interface Budget {
  id: number;
  amount: number;
  categoryId: number;
  category: Category;
  percentage: number;
  createdAt: Date;
}

interface BudgetContextType {
  budgets: Budget[] | null;
  sortOrder: string;
  loading: boolean;
  error: string | null;
  setSortOrder: (order: string) => void;
  fetchBudgets: () => Promise<void>;
  addBudget: (data: Omit<Budget, "id" | "category" | "percentage" | "createdAt">) => Promise<void>;
  deleteBudget: (id: number) => Promise<void>;
  updateBudget: (id: number, data: Partial<Omit<Budget, "category">>) => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budgets, setBudgets] = useState<Budget[] | null>(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TO-DO: Documentation multi line comments (Doc)
  const fetchBudgets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/data/budget/get-budget", { withCredentials: true });

      const sortedBudgets: Budget[] = response.data.sort(
        (a: Budget, b: Budget) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      setBudgets(sortedBudgets);
    } catch (err) {
      console.error(err);
      setError("Failed to load budgets");
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  const addBudget = async (data: Omit<Budget, "id" | "category" | "percentage" | "createdAt">) => {
    try {
      const response = await axios.post("/api/data/budget/create-budget", data, { withCredentials: true });
      setBudgets((prev) => (prev ? [...prev, response.data] : [response.data]));
      await fetchBudgets();
    } catch (err) {
      console.error(err);
      setError("Failed to add budget");
    }
  };

  const deleteBudget = async (id: number) => {
    try {
      await axios.delete(`/api/data/budget/delete-budget/${id}`, { withCredentials: true });
      setBudgets((prev) => prev?.filter((budget) => budget.id !== id) ?? []);
      await fetchBudgets();
    } catch (err) {
      console.error(err);
      setError("Failed to delete budget");
    }
  };

  const updateBudget = async (id: number, data: Partial<Budget>) => {
    try {
      const response = await axios.put(`/api/data/budget/update-budget/${id}`, data, { withCredentials: true });
      setBudgets((prev) => prev?.map((budget) => (budget.id === id ? { ...budget, ...response.data } : budget)) ?? []);
      await fetchBudgets();
    } catch (err) {
      console.error(err);
      setError("Failed to update budget");
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        sortOrder,
        loading,
        error,
        setSortOrder,
        fetchBudgets,
        addBudget,
        deleteBudget,
        updateBudget,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

// Custom hook to use the budget context
export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within a BudgetContextProvider");
  }
  return context;
};
