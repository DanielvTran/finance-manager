"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { TransactionType } from "../../lib/types";
import { Category } from "@prisma/client";

interface Income {
  id: number;
  name: string;
  amount: number;
  date: Date;
  type: TransactionType;
  categoryId: number;
  category: Category;
}

interface IncomeContextType {
  incomes: Income[] | null;
  sortOrder: string;
  loading: boolean;
  error: string | null;
  setSortOrder: (order: string) => void;
  fetchIncomes: () => Promise<void>;
  addIncome: (data: Omit<Income, "id" | "category" | "type">) => Promise<void>;
  deleteIncome: (id: number) => Promise<void>;
  updateIncome: (id: number, data: Partial<Omit<Income, "category">>) => Promise<void>;
}

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

export const IncomeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incomes, setIncomes] = useState<Income[] | null>(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TO-DO: Documentation multi line comments (Doc)
  const fetchIncomes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/data/income/get-income", { withCredentials: true });

      const sortedIncomes = response.data.sort(
        (a: { date: string }, b: { date: string }) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setIncomes(sortedIncomes);
    } catch (err) {
      setError("Failed to load incomes");
      setIncomes([]);
    } finally {
      setLoading(false);
    }
  };

  const addIncome = async (data: Omit<Income, "id" | "category" | "type">) => {
    try {
      const response = await axios.post("/api/data/income/create-income", data, { withCredentials: true });
      setIncomes((prev) => (prev ? [...prev, response.data] : [response.data]));
      await fetchIncomes();
    } catch (err) {
      setError("Failed to add income");
    }
  };

  const deleteIncome = async (id: number) => {
    try {
      await axios.delete(`/api/data/income/delete-income/${id}`, { withCredentials: true });
      setIncomes((prev) => prev?.filter((income) => income.id !== id) ?? []);
      await fetchIncomes();
    } catch (err) {
      setError("Failed to delete income");
    }
  };

  const updateIncome = async (id: number, data: Partial<Income>) => {
    try {
      const response = await axios.put(`/api/data/income/update-income/${id}`, data, { withCredentials: true });
      setIncomes((prev) => prev?.map((income) => (income.id === id ? { ...income, ...response.data } : income)) ?? []);
      await fetchIncomes();
    } catch (err) {
      setError("Failed to update income");
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  return (
    <IncomeContext.Provider
      value={{
        incomes,
        sortOrder,
        loading,
        error,
        setSortOrder,
        fetchIncomes,
        addIncome,
        deleteIncome,
        updateIncome,
      }}
    >
      {children}
    </IncomeContext.Provider>
  );
};

// Custom hook to use the income context
export const useIncome = () => {
  const context = useContext(IncomeContext);
  if (!context) {
    throw new Error("useIncome must be used within a IncomeContextProvider");
  }
  return context;
};
