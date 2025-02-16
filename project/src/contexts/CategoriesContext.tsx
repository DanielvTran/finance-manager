"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface Category {
  id: number;
  name: string;
}

interface CategoryContextType {
  categories: Category[] | null;
  sortOrder: string;
  loading: boolean;
  error: string | null;
  setSortOrder: (order: string) => void;
  fetchCategories: () => Promise<void>;
  addCategory: (data: Omit<Category, "id">) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  updateCategory: (id: number, data: Partial<Category>) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/data/category/get-category", { withCredentials: true });
      setCategories(response.data.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name)));
    } catch (err) {
      console.error(err);
      setError("Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (data: Omit<Category, "id">) => {
    console.log(data);
    try {
      const response = await axios.post("/api/data/category/create-category", data, { withCredentials: true });
      setCategories((prev) => (prev ? [...prev, response.data] : [response.data]));
    } catch (err) {
      console.error(err);
      setError("Failed to add category");
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await axios.delete(`/api/data/category/delete-category/${id}`, { withCredentials: true });
      setCategories((prev) => prev?.filter((category) => category.id !== id) ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to delete category");
    }
  };

  const updateCategory = async (id: number, data: Partial<Category>) => {
    try {
      const response = await axios.put(`/api/data/category/update-category/${id}`, data, { withCredentials: true });
      setCategories(
        (prev) => prev?.map((category) => (category.id === id ? { ...category, ...response.data } : category)) ?? []
      );
    } catch (err) {
      console.error(err);
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
        sortOrder,
        loading,
        error,
        setSortOrder,
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
