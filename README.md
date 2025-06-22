# Udhaaro

## 💡 Personal Story

One day, my mom asked me to help her keep track of grocery items and the money credited, which she had been recording manually in a notebook. Wanting to make things easier and modern for her, and to work on building a real-world app, I created Udhaaro. This app is dedicated to her, and to anyone who wants a simple, digital way to manage grocery expenses.

## 🚀 Project Overview

Udhaaro helps you manage and track your grocery expenses and credits efficiently. It provides a clean UI for adding, viewing, editing, and deleting your monthly grocery credits, with a robust backend and cloud database support.

## ✨ Features

-   **CRUD Operations**: Add, view, edit, and delete grocery credits
-   **Monthly Summary**: View and filter credits by month with summary statistics
-   **Real-time Updates**: Automatic data refresh after operations
-   **Responsive Design**: Modern, mobile-friendly UI (React + Vite + TailwindCSS)
-   **Type-safe API**: RESTful API with TypeScript and Drizzle ORM
-   **Cloud Database**: PostgreSQL with Neon (serverless-ready)
-   **Modern UI Components**: Built with shadcn/ui components
-   **Toast Notifications**: User feedback for all operations

## 🛠️ Tech Stack

-   **Frontend:** React 18, Vite, TypeScript, TailwindCSS, shadcn/ui
-   **Backend:** Node.js, Express, TypeScript
-   **Database:** PostgreSQL (Neon, serverless-ready)
-   **ORM:** Drizzle ORM (type-safe migrations & queries)
-   **State Management:** TanStack Query (React Query)
-   **Deployment:** Vercel (serverless functions + static hosting)

## 📁 Project Structure

```
Udhaaro/
├── api/                    # Vercel serverless API functions
│   ├── credits/           # Credit-related API endpoints
│   │   ├── [id].js       # Individual credit operations (PATCH, DELETE)
│   │   └── month/        # Monthly credit endpoints
│   ├── credits.js        # General credit operations (GET, POST)
│   └── lib/              # Shared API utilities
├── client/               # React frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Frontend utilities
│   └── index.html
├── shared/               # Shared TypeScript schemas
└── server/               # Development server (optional)
```

## 🔌 API Endpoints

### Credits

-   `GET /api/credits` - Get all credits
-   `POST /api/credits` - Create a new credit
-   `PATCH /api/credits/[id]` - Update a credit
-   `DELETE /api/credits/[id]` - Delete a credit

### Monthly Credits

-   `GET /api/credits/month/[year]/[month]` - Get credits for specific month

## ⚡ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/swayamyadav05/GroceryCredit.git
cd GroceryCredit
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root:

```env
POSTGRES_URL=your-neon-postgres-connection-string
DATABASE_URL=your-neon-postgres-connection-string
```

### 4. Run Database Migrations

```bash
npx drizzle-kit push
```

### 5. Start the Development Server

```bash
npm run dev
```

-   The application will run on [http://localhost:5000](http://localhost:5000)
-   The frontend is served from the backend with hot reloading

---

## 🌐 Deployment (Vercel)

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repo to Vercel
3. In Vercel dashboard, set the following environment variables:
    - `POSTGRES_URL`
    - `DATABASE_URL`
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Deploy!

The application uses Vercel's serverless functions for the API and static hosting for the frontend.

---

## ⚙️ Environment Variables

| Name         | Description                         | Required |
| ------------ | ----------------------------------- | -------- |
| POSTGRES_URL | PostgreSQL connection string (Neon) | Yes      |
| DATABASE_URL | Same as above, for Drizzle ORM      | Yes      |

---

## 🎯 Usage

1. **Add Credits**: Use the "Add New Credit" form to record grocery credits
2. **View Credits**: Browse your credit history with monthly filtering
3. **Edit Credits**: Click the edit button (pencil icon) to modify existing entries
4. **Delete Credits**: Click the delete button (trash icon) to remove entries
5. **Monthly Summary**: View totals and statistics for each month

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙋‍♂️ Questions?

Open an issue or contact the maintainer!
