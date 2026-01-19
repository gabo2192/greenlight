# Greenlight - Task Manager

A simple and elegant task management application built with Next.js, React, and PostgreSQL.

## Features

- ✅ Create new tasks
- ✅ Mark tasks as complete
- ✅ Delete tasks (soft delete)
- ✅ Toggle visibility of completed tasks
- ✅ Real-time UI updates with React Query

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Database:** PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **State Management:** [TanStack Query](https://tanstack.com/query)
- **Components:** Base UI / Shadcn
- **Icons:** [Phosphor Icons](https://phosphoricons.com/)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Testing:** [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)

## Prerequisites

- Node.js 20+
- PostgreSQL database
- npm, yarn, pnpm, or bun

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd greenlight
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/greenlight
```

### 4. Set up the database

Run the Drizzle migrations to create the database schema:

```bash
npx drizzle-kit push
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests with Vitest |
| `npm run test:e2e` | Run E2E tests with Playwright |

## Project Structure

```
greenlight/
├── app/                    # Next.js App Router
│   ├── api/tasks/          # API routes for task CRUD
│   ├── page.tsx            # Main page
│   └── layout.tsx          # Root layout
├── components/
│   ├── sections/           # Feature components
│   │   ├── task-form.tsx   # Task creation form
│   │   ├── task-list.tsx   # Task list display
│   │   └── show-completed-tasks.tsx
│   └── ui/                 # Reusable UI components
├── db/
│   └── schema.ts           # Drizzle database schema
├── drizzle/                # Database migrations
├── hooks/
│   └── useTasks.ts         # Task management hook
├── lib/
│   ├── db.ts               # Database connection
│   └── utils.ts            # Utility functions
├── providers/
│   └── app-provider.tsx    # React Query & context providers
├── types/
│   └── tasks.ts            # TypeScript types
├── __tests__/              # Unit tests
└── e2e/                    # E2E tests with Playwright
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Fetch all tasks (supports `?showCompleted=true`) |
| `POST` | `/api/tasks` | Create a new task |
| `PATCH` | `/api/tasks` | Mark a task as complete |
| `DELETE` | `/api/tasks` | Soft delete a task |

## Database Schema

The application uses a single `tasks` table:

| Column | Type | Description |
|--------|------|-------------|
| `id` | serial | Primary key |
| `title` | text | Task title (required) |
| `description` | text | Task description (optional) |
| `completed` | boolean | Completion status |
| `deleted_at` | timestamp | Soft delete timestamp |
| `created_at` | timestamp | Creation timestamp |
| `updated_at` | timestamp | Last update timestamp |

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

Make sure the development server is running, then:

```bash
npm run test:e2e
```

Screenshots from E2E tests are saved in `e2e/screenshots/`.

## Engineering Considerations

If I were to take this to production, here's what I'd focus on:

### Scalability

- **User sessions** — Right now all tasks live in a shared pool. First thing I'd add is user authentication (probably NextAuth) and a `user_id` foreign key on the tasks table. That way each user only sees their own tasks and we avoid any data mixing.
- **Pagination** — The GET endpoint currently returns everything. Once we have hundreds of tasks per user, I'd switch to cursor-based pagination to keep response times snappy.
- **Caching** — Next.js 16 has the new `"use cache"` directive which makes caching explicit and opt-in. I'd use that with `cacheTag()` on the task queries and call `revalidateTag()` on mutations to invalidate stale data.
- **Database indexes** — Adding indexes on `user_id`, `completed`, and `deleted_at` would speed up filtered queries significantly.

### Reliability

- **Idempotency keys** — For the POST endpoint, accepting a client-generated idempotency key would prevent duplicate tasks if a user's network hiccups and retries the request.
- **Better validation** — I'm doing basic title validation now, but Zod schemas would give us runtime type safety and cleaner error messages.
- **Retry logic** — The frontend mutations could use exponential backoff for transient failures instead of just showing an error toast.

### Observability

- **Structured logging** — I'd swap console logs for something like Pino with request IDs so we can trace issues across the stack.
- **Metrics** — Tracking things like task creation rate, API latency (p50/p95/p99), and error rates in Datadog or Prometheus would help catch problems early.
- **Error tracking** — Sentry for catching and alerting on unhandled exceptions in both the API and React components.

## License

MIT