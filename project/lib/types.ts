import { JWTPayload } from "jose";

export interface IUserSettingsForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ICategoriesForm {
  name: string;
}

export interface IIncomesForm {
  name: string;
  categoryId: number;
  date: Date;
  amount: number;
}

export interface IExpensesForm {
  name: string;
  categoryId: number;
  date: Date;
  amount: number;
}

export interface IBudgetForm {
  categoryId: number;
  amount: number;
}

export interface TokenPayload extends JWTPayload {
  id: number;
  email: string;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  transactions: ITransaction[];
  budgets: IBudget[];
}

export interface ICategory {
  id: number;
  name: string;
  transactions: ITransaction[];
  budgets: IBudget[];
}

export interface ITransaction {
  id: number;
  amount: number;
  date: Date;
  type: TransactionType;
  userId: number;
  categoryId: number;
  createdAt: Date;
  User?: IUser;
  Category?: ICategory;
}

export interface IBudget {
  id: number;
  amount: number;
  startDate: Date;
  endDate: Date;
  userId: number;
  categoryId: number;
  createdAt: Date;
  User?: IUser;
  Category?: ICategory;
}

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export interface Category {
  id: number;
  name: string;
}
