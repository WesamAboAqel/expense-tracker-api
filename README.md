# Expense Tracker API

The Expense Tracker API is a backend application built to manage personal expenses in a secure, user-scoped way. It exposes a set of HTTP endpoints that allow authenticated users to create, read, update, delete, and filter expense records stored in a PostgreSQL database.

The project is implemented using Node.js, TypeScript, Express, PostgreSQL, and Kysely, with an emphasis on understanding how backend APIs work at a fundamental level rather than relying heavily on high-level abstractions.

Authentication is handled using JWT-based access and refresh tokens, ensuring that all expense operations are scoped to the authenticated user. The API follows a layered architecture, separating HTTP concerns (routes and controllers) from database access (repositories), and uses query-based filtering to retrieve data efficiently without creating excessive endpoints.

This project is based on the roadmap.sh backend practice project:
https://roadmap.sh/projects/expense-tracker-api

---

## Scope

This project focuses on backend fundamentals such as authentication, data access patterns, and API design. It intentionally does not cover frontend concerns, UI, or production deployment hardening.

---

## Features

-   JWT access tokens with rotating refresh tokens and session revocation
-   User signup/login and protected routes via bearer authentication
-   Expense CRUD with filtering by category, date range, and amount range per user
-   Kysely-powered PostgreSQL queries with typed schema and migration workflow
-   Request logging with colored output and ~~centralized error handling~~ (planned)
-   Docker Compose setup for local Postgres + API development

---

## Tech Stack

-   Node.js, Express , TypeScript, ts-node
-   PostgreSQL, Kysely query builder
-   JWT, bcrypt for authentication and password hashing
-   Docker and docker-compose for local orchestration

---

## Prerequisites

-   Node.js v25.2.1 and npm
-   Docker and docker-compose (recommended for local Postgres)

---

## Environment Variables

Create a `.env` file in the project root. Use strong secrets in real deployments.

| Variable           | Description                       | Example                                                         |
| ------------------ | --------------------------------- | --------------------------------------------------------------- |
| `DATABASE_URL`     | Postgres connection string        | `postgresql://expense_admin:12345678@localhost:5432/expense_db` |
| `JWT_TOKEN_SECRET` | Secret used to sign access tokens | `super-long-random-string`                                      |

> When using Docker Compose, the default credentials in `docker-compose.yml` match the example connection string above. Adjust as needed.

---

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Set up Postgres (pick one):
    - **Docker (recommended):** `docker compose up database -d`
    - **Local Postgres:** ensure a database matching your `DATABASE_URL` exists.
3. Run migrations to create tables:

```bash
npm run db:migrate
```

4. Start the API (watches for changes):

```bash
npm run dev
```

The server listens on `http://localhost:3000`.

---

## Run with Docker Compose (API + DB)

```bash
docker compose up --build
```

After containers are up, apply migrations inside the backend container:

```bash
docker compose exec backend npm run db:migrate
```

---

## Database Migrations

-   Create a new migration: `npm run db:create-migration add_my_table`
-   Apply migrations: `npm run db:migrate`
    Migrations live in `database/migrations/` and are powered by Kysely.

---

## API Overview

Base URL: `http://localhost:3000/api`

**Auth**

-   `POST /auth/login` — body: `{ "username": string, "password": string }` → returns `accessToken` + `refreshToken`.
-   `POST /auth/refresh` — body: `{ "refreshToken": string }` → returns rotated tokens.

**Users**

-   `POST /users/signup` — body: `{ "username", "name", "password" }` to create an account.
-   ~~`GET /users/getall` — requires bearer token; lists users.~~

**Expenses** (all require `Authorization: Bearer <accessToken>`)

-   `POST /expenses/add` — body: `{ "description", "amount", "date", "category" }` to create an expense.

-   `GET /expenses/user` — fetch current user expenses with optional filters: `category`, `startDate`, `endDate`, `minAmount`, `maxAmount`.
-   `GET /expenses/:id` — fetch a single expense.
-   `PUT /expenses/:id` — update fields: `description`, `amount`, `date`, `category`.
-   `DELETE /expenses/:id` — remove an expense.

### Example Requests

Login to get tokens:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo"}'
```

Create an expense:

```bash
curl -X POST http://localhost:3000/api/expenses/add \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"description":"Groceries","amount":42,"date":"2024-01-15","category":"Food"}'
```

Filtering Example:

```bash
GET /api/expenses?category=Food&startDate=2024-01-01&endDate=2024-01-31&minAmount=10
```

### Authentication Flow

1. User logs in and receives an access token and refresh token.
2. Access token is sent as a Bearer token on protected routes.
3. Refresh token is used to rotate tokens when the access token expires.

### Postman Collection

A Postman collection for testing the API is included in this repository:

`postman/Expenses API.postman_collection.json`

Import it into Postman to test authentication, expenses CRUD, and filtering.

#### **OR**

You can test the API using the [Public Postman collection](https://www.postman.com/wesamabuaqel/workspace/wesamaboaqel/collection/37753689-4927299a-43dd-4e7f-810b-0fa4e85bb537?action=share&creator=37753689&active-environment=37753689-807aa21c-7028-4b7c-8598-1c1d98eeac97)

---

## Project Structure

-   `server.ts` — Express app wiring routes, middleware, and startup
-   `controllers/` — request/response handling for auth, users, expenses
-   `repositories/` — Kysely queries and transactions for users, sessions, expenses
-   `middleware/` — JWT auth, token generation, logger, error handler
-   `database/` — schema typings, migrations, migration runner
-   `routes/` — Express routers for auth, users, expenses
-   `utils/` — helpers (date/time formatting)

---

## Notes

-   Authentication uses bearer access tokens; refresh tokens are hashed and stored in the `sessions` table to enable rotation and revocation.
-   Expense filtering supports category plus date and amount ranges for per-user views.
-   Logging outputs ISO timestamps with color-coded HTTP methods for quick debugging.

---

## License

MIT

---
