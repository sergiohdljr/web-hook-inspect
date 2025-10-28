# Webhook Inspect

A full-stack application for inspecting and monitoring incoming webhooks in real-time. This tool allows you to capture, analyze, and debug webhook requests with a modern web interface.

## 🚀 Technologies Used

### Backend (API)
- **[Fastify](https://fastify.dev/)** - Fast and low overhead web framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM for SQL databases
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[Fastify Swagger](https://github.com/fastify/fastify-swagger)** - OpenAPI documentation
- **[Scalar API Reference](https://github.com/scalar/scalar)** - Beautiful API documentation UI
- **[Biome](https://biomejs.dev/)** - Fast code formatter and linter
- **[Docker](https://www.docker.com/)** - Containerization for PostgreSQL

### Frontend (Web)
- **[React](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vite.dev/)** - Fast build tool and dev server
- **[ESLint](https://eslint.org/)** - Code linting

### Monorepo Management
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **pnpm workspaces** - Monorepo workspace management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **pnpm** (v10.19.0 or higher)
- **Docker** and **Docker Compose** (for PostgreSQL)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd webhook-inspect
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up the database

Start the PostgreSQL database using Docker:

```bash
cd api
docker-compose up -d
```

### 4. Configure environment variables

Create a `.env` file in the `api` directory:

```bash
cd api
cp .env.example .env  # If example exists, or create manually
```

Add the following environment variables:

```env
DATABASE_URL=postgresql://docker:docker@localhost:5432/webhook-inspect
PORT=3333
```

### 5. Run database migrations

Generate and run the database migrations:

```bash
cd api
pnpm db:generate
pnpm db:migrate
```

## 🚀 Running the Application

### Development Mode

You'll need to run both the API and web frontend in separate terminals.

#### Terminal 1 - Start the API server:

```bash
cd api
pnpm dev
```

The API will be available at:
- **API**: http://localhost:3333
- **API Documentation**: http://localhost:3333/docs

#### Terminal 2 - Start the web frontend:

```bash
cd web
pnpm dev
```

The web interface will be available at: http://localhost:5173 (or the port shown in terminal)

## 📦 Available Scripts

### Root Level
```bash
pnpm install          # Install all dependencies
```

### API (`/api`)
```bash
pnpm dev              # Start development server with hot reload
pnpm start            # Start production server
pnpm format           # Format code with Biome
pnpm db:generate      # Generate database migrations
pnpm db:migrate       # Run database migrations
pnpm db:studio        # Open Drizzle Studio (database GUI)
```

### Web (`/web`)
```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm lint             # Lint code with ESLint
```

## 🗄️ Database Management

### View Database with Drizzle Studio

```bash
cd api
pnpm db:studio
```

This will open Drizzle Studio in your browser, providing a GUI to view and manage your database.

### Stop the Database

```bash
cd api
docker-compose down
```

## 📁 Project Structure

```
webhook-inspect/
├── api/                    # Backend API
│   ├── src/
│   │   ├── db/
│   │   │   └── schema/    # Database schemas
│   │   ├── routes/        # API routes
│   │   └── server.ts      # Server entry point
│   ├── docker-compose.yaml
│   ├── drizzle.config.ts
│   └── package.json
├── web/                    # Frontend application
│   ├── src/
│   ├── public/
│   └── package.json
├── package.json            # Root package.json
└── pnpm-workspace.yaml     # Workspace configuration
```

## 🔧 Development Tips

- The API uses **hot reload** via `tsx watch`, so changes are reflected immediately
- The web frontend uses **Vite HMR** for instant updates
- Use `pnpm db:studio` to visually inspect your database
- API documentation is automatically generated and available at `/docs`

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
