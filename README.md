# GroceryCredit

## 💡 Personal Story

One day, my mom asked me to help her keep track of grocery items and the money spent, which she had been recording manually in a notebook. Wanting to make things easier and mordern for her, and to work on to build a real-world app, I created GroceryCredit. This app is dedicated to her, and to anyone who wants a simple, digital way to manage grocery credits.

## 🚀 Project Overview

GroceryCredit helps you manage and track your grocery expenses and credits efficiently. It provides a clean UI for adding, viewing, and summarizing your monthly grocery credits, with a robust backend and cloud database support.

## ✨ Features

-   Add, update, and delete grocery credits
-   Monthly summary and filtering
-   Responsive, modern UI (React + Vite + TailwindCSS)
-   RESTful API (Express)
-   PostgreSQL database (Neon, serverless-ready)
-   Drizzle ORM for type-safe database access and migrations

## 🛠️ Tech Stack

-   **Frontend:** React, Vite, TypeScript, TailwindCSS
-   **Backend:** Node.js, Express, TypeScript
-   **Database:** PostgreSQL (Neon, serverless-ready)
-   **ORM:** Drizzle ORM (type-safe migrations & queries)
-   **Deployment:** Vercel (CI/CD for seamless updates)

## ⚡ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/grocerycredit.git
cd grocerycredit
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

-   The backend/API will run on [http://localhost:5000](http://localhost:5000)
-   The frontend is served from the backend (or you can run Vite separately in `client/` if needed)

---

## 🌐 Deployment (Vercel)

1. Push your code to GitHub/GitLab/Bitbucket.
2. Connect your repo to Vercel.
3. In Vercel dashboard, set the following environment variables:
    - `POSTGRES_URL`
    - `DATABASE_URL`
4. Set build command: `npm run build`
5. Set output directory: `client/dist`
6. (Optional) Add a build step to run `npx drizzle-kit push` for migrations.
7. Deploy!

---

## ⚙️ Environment Variables

| Name         | Description                         |
| ------------ | ----------------------------------- |
| POSTGRES_URL | PostgreSQL connection string (Neon) |
| DATABASE_URL | Same as above, for Drizzle ORM      |

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
