# Milestone Plan for Personal Finance Manager

### Tools and Frameworks

- **Frontend**: Next.js (with API routes for backend functionality)
- **Styling**: Tailwind CSS
- **UI Library**: DaisyUI
- **Database**: MySQL (designed in MySQL Workbench)

---

## Milestone 1: Project Setup and Basic Structure

**Goal**: Set up the core structure of the project to provide a solid foundation for further development.

- [x] **Initialize Project with Next.js**

  - [x] Set up a new Next.js project.
  - [x] Install necessary packages: Tailwind CSS, DaisyUI, Axios, MySQL.

- [x] **Set Up Tailwind CSS**

  - [x] Configure Tailwind CSS and integrate it with Next.js.
  - [x] Set up custom colors and fonts if needed.

- [x] **Configure Database Connection**

  - [x] Install `mysql2` package for connecting to MySQL.
  - [x] Install `prisma` for handling ORM
  - [x] Create a `.env` file and set up environment variables for MySQL connection (database URL, username, password).

- [x] **Set Up Basic Folder Structure**

  - [x] Create folders for `components`, `pages`, `api`.

- [x] **Git Initialization**
  - [x] Initialize a Git repository, add a `.gitignore` file, and make the initial commit.

---

## Milestone 2: Database Design and Implementation

**Goal**: Design the database schema in MySQL Workbench and set up the database.

- [x] **Define Database Schema**

  - [x] Use MySQL Workbench to create tables: `Users`, `Transactions`, `Categories`, and `Budgets`.

- [x] **Database Relationships**

  - [x] `Users` table with a one-to-many relationship to `Transactions`.
  - [x] `Categories` with a many-to-one relationship to `Transactions`.
  - [x] `Budgets` with one-to-one or one-to-many relationships with `Users` and `Categories`.

- [x] **Implement Database Migrations**

  - [x] Use `Prisma` ORM (optional) to handle migrations and database interactions, or write SQL scripts for setting up the database tables.

- [x] **Test Database Connectivity**
  - [x] Create a simple Next.js API route (`api/test`) to test connectivity with the database.

---

## Milestone 3: User Authentication

**Goal**: Implement user authentication and secure access to the application.

- [x] **Set Up Registration Endpoint**

  - [x] Create an API route (`api/auth/signup`) that accepts a email, and password.
  - [x] Hash passwords using `bcrypt` and store them securely in the database.

- [x] **Login Endpoint**

  - [x] Create a `login` API route (`api/auth/login`) to validate user credentials.
  - [x] Return a JSON Web Token (JWT) upon successful login to maintain session.

- [x] **Protect Routes and Implement JWT Middleware**
  - [x] Create a middleware function to protect certain API routes and frontend pages.
  - [x] Store the JWT in cookies or local storage, as appropriate.

---

## Milestone 4: Income and Expense Tracking

**Goal**: Implement core features for adding, viewing, editing, and deleting transactions.

- [x] **API Endpoints for Transactions**

  - [x] Set up CRUD API routes for transactions (`api/transactions`).
  - [x] Define endpoints for creating, reading, updating, and deleting transactions.

- [x] **Create Transaction Page**

  - [x] Build a form with fields for date, category, amount, and type (income or expense).
  - [x] Use a dropdown to select the category and radio buttons to choose between income and expense.

- [x] **Transaction List Component**
  - [x] Create a component that displays a list of all transactions, showing details like date, amount, category, and type.
  - [x] Add edit and delete buttons next to each transaction.

---

## Milestone 5: Budgeting Module

**Goal**: Implement budget setting and tracking functionality.

- [x] **API Endpoints for Budgets**

  - [x] Create API routes for setting, updating, and retrieving budget information.

- [x] **Set Budget UI**

  - [x] Create a form for users to set budgets for specific categories (e.g., food, transportation).
  - [x] Allow users to enter a monthly or weekly budget amount for each category.

- [x] **Display Budget Progress**
  - [x] Create a dashboard component to show the budget usage per category.
  - [x] Highlight categories that have exceeded the budget in red or another warning color.

---

## Milestone 6: Finalization and Deployment

**Goal**: Test, document, and deploy the application.

- [ ] **Testing**

  - [ ] Conduct end-to-end testing to ensure all features work as expected.
  - [ ] Test for usability, performance, and security.

- [ ] **Documentation**

  - [ ] Document the codebase, API routes, database schema, and key application functionalities.
  - [ ] Write a user guide or README for setup, usage, and troubleshooting.

- [x] **Deployment**
  - [x] Deploy the application using Vercel for Next.js frontend/backend API.
  - [x] Configure environment variables and database connection on the deployed environment.
  - [ ] Optionally, set up automated CI/CD if needed.

---

## Summary of Milestones and Timeline

1. **Milestone 1**: Project setup and structure.
2. **Milestone 2**: Database design and setup.
3. **Milestone 3**: User authentication.
4. **Milestone 4**: Income and expense tracking.
5. **Milestone 5**: Budgeting module.
6. **Milestone 6**: Finalization, testing, documentation, and deployment.

---
