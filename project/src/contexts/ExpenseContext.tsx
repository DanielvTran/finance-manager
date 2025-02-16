"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { TransactionType } from "../../lib/types";
import { Category } from "@prisma/client";

interface Expense {
  id: number;
  name: string;
  amount: number;
  date: Date;
  type: TransactionType;
  categoryId: number;
  category: Category;
}

interface ExpenseContextType {
  expenses: Expense[] | null;
  sortOrder: string;
  loading: boolean;
  error: string | null;
  setSortOrder: (order: string) => void;
  fetchExpenses: () => Promise<void>;
  addExpense: (data: Omit<Expense, "id" | "category" | "type">) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
  updateExpense: (id: number, data: Partial<Omit<Expense, "category">>) => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[] | null>(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TO-DO: Documentation multi line comments (Doc)
  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/data/expense/get-expense", { withCredentials: true });
      setExpenses(response.data.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name)));
    } catch (err) {
      console.error(err);
      setError("Failed to load expenses");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (data: Omit<Expense, "id" | "category" | "type">) => {
    try {
      const response = await axios.post("/api/data/expense/create-expense", data, { withCredentials: true });
      setExpenses((prev) => (prev ? [...prev, response.data] : [response.data]));
      await fetchExpenses();
    } catch (err) {
      console.error(err);
      setError("Failed to add expense");
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      await axios.delete(`/api/data/expense/delete-expense/${id}`, { withCredentials: true });
      setExpenses((prev) => prev?.filter((expense) => expense.id !== id) ?? []);
      await fetchExpenses();
    } catch (err) {
      console.error(err);
      setError("Failed to delete expense");
    }
  };

  const updateExpense = async (id: number, data: Partial<Expense>) => {
    try {
      const response = await axios.put(`/api/data/expense/update-expense/${id}`, data, { withCredentials: true });
      setExpenses(
        (prev) => prev?.map((expense) => (expense.id === id ? { ...expense, ...response.data } : expense)) ?? []
      );
      await fetchExpenses();
    } catch (err) {
      console.error(err);
      setError("Failed to update expense");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        sortOrder,
        loading,
        error,
        setSortOrder,
        fetchExpenses,
        addExpense,
        deleteExpense,
        updateExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook to use the expense context
export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpense must be used within a ExpenseContextProvider");
  }
  return context;
};
