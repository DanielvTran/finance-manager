# Personal Finance Manager - Screen Layout and UX Flow

## Colour Palette

- **Primary Mint Green**: #98FF98
- **Soft Mint Green**: #DFFFE2
- **Muted Dark Gray**: #323E42
- **Deep Teal**: #3A6F66
- **Light Gray**: #F2F2F2
- **Medium Gray**: #B0B0B0
- **Bright Teal Accent**: #4DD0E1

---

## Font Sizes

### Heading Font

- **Size**: 18-24px
- **Usage**: Main titles and section headers, providing clear navigation and hierarchy.

### Subheading Font

- **Size**: 16-18px
- **Usage**: Secondary headings and subtitles, offering structure within sections.

### Body Font

- **Size**: 14-16px
- **Usage**: General content, form text, descriptions, ensuring readability across devices.

### Small Text

- **Size**: 12-14px
- **Usage**: Less prominent text such as captions, labels, and hints, used for additional information without overpowering main content.

---

## Screens Checklist

- [x] **Welcome Screen**

  - Purpose: Introduction to the app, setting the tone and welcoming users.
  - Elements:
    - App logo and name.
    - Brief app description (optional).
    - Buttons to **Sign Up** or **Log In**.
  - Navigation: Leads to the Login or Sign Up screens.

- [x] **Sign Up Screen**

  - Purpose: Allow new users to create an account.
  - Elements:
    - Input fields: First name, Last name, Email, Password.
    - Sign Up button.
    - Link to **Log In** (for users who already have an account).
    - Error messages for validation (e.g., password length, email format).
  - Navigation: After a successful sign-up, navigate to the Dashboard.

- [x] **Login Screen**

  - Purpose: Authenticate existing users.
  - Elements:
    - Input fields: Email, Password.
    - Login button.
    - Link to **Sign Up**.
    - "Forgot Password?" option (optional).
    - Error messages for incorrect login details.
  - Navigation: After successful login, navigate to the Dashboard.

- [x] **Dashboard Screen**

  - Purpose: Provide an overview of the user’s finances and quick access to main functionalities.
  - Elements:
    - Summary section for:
      - Current balance, recent transactions, budget usage, etc.
    - Quick links/buttons for:
      - **Add Transaction**, **Set Budget**, **View Reports**.
    - Brief summary of monthly spending and income.
    - Optional chart or graph for quick insights (e.g., spending categories).
  - Navigation: Links/buttons to navigate to different sections, including Transactions, Budgets, and Reports.

- [x] **Transaction Management Screen**

  - Purpose: Enable users to view, add, edit, or delete transactions.
  - Elements:
    - List of recent transactions with basic info (date, category, amount).
    - Filter or search functionality (e.g., by date, category).
    - **Add Transaction** button.
  - Add/Edit Transaction Modal/Form:
    - Fields: Date, Amount, Category (dropdown), Description (optional).
    - Buttons: Save, Cancel.
  - Navigation: Accessible from the Dashboard, with CRUD functionality to manage transactions easily.

- [x] **Category Management Screen**

  - Purpose: Allow users to create, edit, and delete categories for organizing transactions.
  - Elements:
    - List of categories with options to edit or delete each.
    - **Add Category** button.
  - Add/Edit Category Modal/Form:
    - Fields: Category name, Description (optional).
    - Buttons: Save, Cancel.
  - Navigation: Accessible from the Dashboard or Transaction Management screen.

- [x] **Budget Management Screen**

  - Purpose: Allow users to set and track budgets for different categories or overall monthly budget.
  - Elements:
    - List of categories with corresponding budgets and progress bars.
    - Total monthly budget tracker with remaining budget.
    - **Add/Edit Budget** button.
  - Add/Edit Budget Modal/Form:
    - Fields: Category (dropdown), Budget amount.
    - Buttons: Save, Cancel.
  - Navigation: Accessible from the Dashboard or Transaction Management screen.

- [x] **Reports Screen**

  - Purpose: Provide users with detailed reports on their income, expenses, and budget usage.
  - Elements:
    - Filters for report type (Monthly, Yearly) and date range.
    - Summary sections for total income, total expenses, and budget usage.
    - Data visualization (bar chart, pie chart, or line graph) for spending categories, income vs. expenses, etc.
    - **Export Report** button (to export as PDF or CSV).
  - Navigation: Accessible from the Dashboard.

- [x] **Settings Screen**

  - Purpose: Enable users to manage account settings and preferences.
  - Elements:
    - Options for changing password, email, or username.
    - Toggle for notifications or alerts (e.g., budget limit alerts).
    - Option to delete the account (with confirmation).
  - Navigation: Accessible from the Dashboard or Profile icon.
