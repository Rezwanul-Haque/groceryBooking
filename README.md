# Grocery Booking API

A REST API for managing grocery items and bookings, built with NestJS, TypeScript, and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL 16
- **ORM**: TypeORM
- **Auth**: JWT (Passport)
- **Containerization**: Docker + Docker Compose

## Roles

| Role  | Capabilities |
|-------|-------------|
| Admin | Add, view, update, remove grocery items; manage inventory |
| User  | View available groceries; place orders with multiple items |

## API Endpoints

### Auth
| Method | Endpoint              | Access  |
|--------|-----------------------|---------|
| POST   | /api/v1/auth/register | Public  |
| POST   | /api/v1/auth/login    | Public  |

### Groceries
| Method | Endpoint                        | Access     |
|--------|---------------------------------|------------|
| GET    | /api/v1/groceries               | Public     |
| GET    | /api/v1/groceries/:id           | Public     |
| POST   | /api/v1/groceries               | Admin only |
| PUT    | /api/v1/groceries/:id           | Admin only |
| DELETE | /api/v1/groceries/:id           | Admin only |
| PATCH  | /api/v1/groceries/:id/inventory | Admin only |

### Orders
| Method | Endpoint            | Access         |
|--------|---------------------|----------------|
| POST   | /api/v1/orders      | Authenticated  |
| GET    | /api/v1/orders      | Authenticated  |
| GET    | /api/v1/orders/:id  | Authenticated  |

### Users
| Method | Endpoint            | Access        |
|--------|---------------------|---------------|
| GET    | /api/v1/users/profile | Authenticated |

## Project Structure

```
groceryBooking/
├── Makefile
├── docker-compose.yaml
└── backend/
    ├── docker/Dockerfile
    ├── src/
    │   ├── main.ts
    │   ├── app.module.ts
    │   ├── features/
    │   │   ├── auth/           # JWT auth, guards, strategy
    │   │   ├── users/          # User domain
    │   │   ├── groceries/      # Grocery domain
    │   │   └── orders/         # Order domain
    │   ├── infra/
    │   │   ├── database/       # TypeORM setup, migrations, DataSource
    │   │   ├── logger/         # Structured JSON logger
    │   │   └── middleware/     # Request logger
    │   └── shared/
    │       ├── config/         # App configuration
    │       ├── decorators/     # @CurrentUser
    │       ├── enums/          # Role enum
    │       ├── filters/        # HttpExceptionFilter
    │       ├── interceptors/   # ResponseInterceptor
    │       └── interfaces/     # JwtPayload
    └── test/                   # E2E tests
```

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### Run with Docker

```bash
# Copy environment file
cp backend/.env.example backend/.env

# Start API + PostgreSQL in background
make dev

# View logs
make logs

# Stop all services
make dev-down
```

The API will be available at `http://localhost:3000`.

### Run locally (without Docker)

```bash
cd backend
npm install
cp .env.example .env   # set DB_HOST=localhost
npm run start:dev
```

### Run tests

```bash
make test
```

## Environment Variables

| Variable       | Default                  | Description           |
|----------------|--------------------------|-----------------------|
| PORT           | 3000                     | API port              |
| NODE_ENV       | development              | Environment           |
| DB_HOST        | localhost                | PostgreSQL host       |
| DB_PORT        | 5432                     | PostgreSQL port       |
| DB_USERNAME    | postgres                 | Database user         |
| DB_PASSWORD    | postgres                 | Database password     |
| DB_NAME        | grocery_db               | Database name         |
| JWT_SECRET     | change-me-in-production  | JWT signing secret    |
| JWT_EXPIRES_IN | 1d                       | Token expiry          |

## Database Migrations

```bash
cd backend

# Generate a migration from entity changes
npm run migration:generate -- src/infra/database/migrations/MigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```
