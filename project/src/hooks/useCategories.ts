// hooks/useCategories.ts
import { useState, useEffect } from "react";
import axios from "axios";

interface Category {
  id: number;
  name: string;
  description: string;
  userId: number;
}

export function useCategories() {
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
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (data: Omit<Category, "id" | "userId">) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/data/create-category", data);
      setCategories((prev) => (prev ? [...prev, response.data] : [response.data]));
      return response.data;
    } catch (err) {
      setError("Failed to add category");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: number, data: Partial<Category>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/categories/${id}`, data);
      setCategories((prev) => prev?.map((cat) => (cat.id === id ? { ...cat, ...response.data } : cat)) ?? null);
      return response.data;
    } catch (err) {
      setError("Failed to update category");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/categories/${id}`);
      setCategories((prev) => prev?.filter((cat) => cat.id !== id) ?? null);
    } catch (err) {
      setError("Failed to delete category");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
