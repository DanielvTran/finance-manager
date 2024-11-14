"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Category, Transaction, Budget } from "../../lib/types";
import axios from "axios";

interface DataContextType {
  categories: Category[] | null;
  transactions: Transaction[] | null;
  budgets: Budget[] | null;
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchBudgets: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [budgets, setBudgets] = useState<Budget[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (err) {
      setError("Failed to load categories");
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transactions");
      setTransactions(response.data);
    } catch (err) {
      setError("Failed to load transactions");
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await axios.get("/api/budgets");
      setBudgets(response.data);
    } catch (err) {
      setError("Failed to load budgets");
    }
  };

  return (
    <DataContext.Provider
      value={{
        categories,
        transactions,
        budgets,
        loading,
        error,
        fetchCategories,
        fetchTransactions,
        fetchBudgets,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataContextProvider");
  }
  return context;
};
