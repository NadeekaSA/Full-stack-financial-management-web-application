# Finance Tracker of CS of ICBT

This is a web application built to manage the finances of the Computer Science department at ICBT. It provides features for tracking income and expenses, managing budgets, and generating reports. The application has role-based access control, with different permissions for "members" and "treasurers".

## Features

*   **Authentication:** Secure user authentication using Supabase.
*   **Role-Based Access Control:**  "members" can view financial data, while "treasurers" have additional permissions to add, edit, and manage transactions, budgets, and files.
*   **Dashboard:** An overview of the current financial status, including total income, total expenses, and the current balance.
*   **Transaction Management:** Add, view, and manage income and expense transactions.
*   **Budget Management:** Set and track monthly budgets.
*   **File Management:** Upload and view financial documents.
*   **Data Export:** Export financial data to CSV format.
*   **Calculator:** A simple calculator for quick calculations.

## Technologies Used

*   **Frontend:**
    *   [React](https://reactjs.org/)
    *   [Vite](https://vitejs.dev/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [Lucide React](https://lucide.dev/guide/packages/lucide-react) for icons.
*   **Backend:**
    *   [Supabase](https://supabase.io/) for database and authentication.

## Getting Started

### Prerequisites

*   Node.js and npm (or yarn) installed on your machine.
*   A Supabase account.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Supabase:**
    *   Create a new project on [Supabase](https://supabase.io/).
    *   In your Supabase project, go to the SQL Editor and run the SQL queries in `supabase/schema.sql` to create the necessary tables.
    *   Go to **Settings** -> **API** and find your Project URL and `anon` public key.
    *   Create a `.env.local` file in the root of your project and add your Supabase credentials:

        ```
        VITE_SUPABASE_URL=your-supabase-project-url
        VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
        ```

### Usage

1.  **Start the development server:**

    ```bash
    npm run dev
    ```

2.  Open your browser and navigate to `http://localhost:5173` (or the address shown in your terminal).

3.  **Build for production:**

    ```bash
    npm run build
    ```

## Supabase Configuration

This project relies on a specific database schema in Supabase. You will need to set up the following tables:

*   `transactions`
*   `budgets`
*   `files`

You will also need to configure Row Level Security (RLS) policies to ensure that users can only access the data they are permitted to. The treasurer role should have more permissions than the member role.
