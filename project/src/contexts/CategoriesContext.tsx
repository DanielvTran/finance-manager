"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface Category {
  id: number;
  name: string;
  description: string;
}

interface CategoryContextType {
  categories: Category[] | null;
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (data: Omit<Category, "id">) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  updateCategory: (id: number, data: Partial<Category>) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/data/get-category", { withCredentials: true });
      setCategories(response.data);
    } catch (err) {
      setError("Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (data: Omit<Category, "id">) => {
    try {
      const response = await axios.post("/api/data/create-category", data, { withCredentials: true });
      setCategories((prev) => (prev ? [...prev, response.data] : [response.data]));
    } catch (err) {
      setError("Failed to add category");
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await axios.delete(`/api/data/delete-category/${id}`, { withCredentials: true });
      setCategories((prev) => prev?.filter((category) => category.id !== id) ?? []);
    } catch (err) {
      setError("Failed to delete category");
    }
  };

  const updateCategory = async (id: number, data: Partial<Category>) => {
    try {
      const response = await axios.put(`/api/data/update-category/${id}`, data, { withCredentials: true });
      setCategories(
        (prev) => prev?.map((category) => (category.id === id ? { ...category, ...response.data } : category)) ?? []
      );
    } catch (err) {
      setError("Failed to update category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        error,
        fetchCategories,
        addCategory,
        deleteCategory,
        updateCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

// Custom hook to use the category context
export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryContextProvider");
  }
  return context;
};
