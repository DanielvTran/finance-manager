import { JWTPayload } from "jose";

export interface IUserSettingsForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ICategoriesForm {
  name: string;
  description: string;
}

export interface TokenPayload extends JWTPayload {
  id: number;
  email: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  transactions: Transaction[];
  budgets: Budget[];
}

export interface Category {
  id: number;
  name: string;
  transactions: Transaction[];
  budgets: Budget[];
}

export interface Transaction {
  id: number;
  amount: number;
  date: Date;
  type: TransactionType;
  userId: number;
  categoryId: number;
  createdAt: Date;
  User?: User;
  Category?: Category;
}

export interface Budget {
  id: number;
  amount: number;
  startDate: Date;
  endDate: Date;
  userId: number;
  categoryId: number;
  createdAt: Date;
  User?: User;
  Category?: Category;
}

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}
