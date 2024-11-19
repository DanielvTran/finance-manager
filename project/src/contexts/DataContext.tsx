"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ICategory, ITransaction, Budget } from "../../lib/types";
import axios from "axios";

interface DataContextType {
  categories: ICategory[] | null;
  transactions: ITransaction[] | null;
  budgets: Budget[] | null;
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<ICategory[] | null>(null);
  const [transactions, setTransactions] = useState<ITransaction[] | null>(null);
  const [budgets, setBudgets] = useState<Budget[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/data/get-category", { withCredentials: true });
        setCategories(response.data);
      } catch (err) {
        setError("Failed to load categories");
        setCategories(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
