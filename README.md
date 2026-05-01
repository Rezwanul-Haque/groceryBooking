# Grocery Booking API

A REST API for managing grocery items and bookings, built with NestJS, TypeScript, and PostgreSQL.

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### Run with Docker

```bash
# Start API + PostgreSQL (creates backend/.env from .env.example automatically)
make dev

# View logs
make logs

# Stop all services
make dev-down
```

The API will be available at `http://localhost:3000`.  
Swagger docs at `http://localhost:3000/api/docs`.

### Run locally (without Docker)

```bash
cd backend
npm install
cp .env.example .env   # update DB_HOST=localhost and secrets
npm run start:dev
```

### Run tests

```bash
make test
```

## Tech Stack

- **Runtime**: Node.js 22 LTS
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL 16
- **ORM**: TypeORM
- **Auth**: JWT (Passport)
- **Docs**: Swagger / OpenAPI
- **Containerization**: Docker + Docker Compose

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
    │   │   ├── auth/           # JWT auth, guards, strategy, decorators
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

## Roles

| Role  | Capabilities |
|-------|-------------|
| Admin | Add, view, update, remove grocery items; manage inventory |
| User  | View available groceries; place orders with multiple items |

### Creating an Admin Account

There is no public way to self-assign the admin role. To register as admin, pass the `X-Admin-Secret` header with the value configured in `ADMIN_SECRET`:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "X-Admin-Secret: change-this-admin-secret" \
  -d '{ "name": "Admin", "email": "admin@example.com", "password": "password123" }'
```

Registrations without the header (or with the wrong secret) always receive the `user` role.

## API Endpoints

### Auth
| Method | Endpoint                | Access  | Notes |
|--------|-------------------------|---------|-------|
| POST   | /api/v1/auth/register   | Public  | Add `X-Admin-Secret` header to register as admin |
| POST   | /api/v1/auth/login      | Public  | Returns JWT access token |

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
| Method | Endpoint            | Access        |
|--------|---------------------|---------------|
| POST   | /api/v1/orders      | Authenticated |
| GET    | /api/v1/orders      | Authenticated |
| GET    | /api/v1/orders/:id  | Authenticated |

### Users
| Method | Endpoint              | Access        |
|--------|-----------------------|---------------|
| GET    | /api/v1/users/profile | Authenticated |

## Swagger Docs

Interactive API docs are available at `http://localhost:3000/api/docs` once the server is running.

To test protected endpoints in Swagger:
1. Call `/api/v1/auth/login` and copy the `accessToken` from the response
2. Click the **Authorize** button at the top of the page
3. Paste the token and confirm

## Environment Variables

| Variable       | Default                         | Description                                 |
|----------------|---------------------------------|---------------------------------------------|
| PORT           | 3000                            | API port                                    |
| NODE_ENV       | development                     | Environment                                 |
| DB_HOST        | localhost                       | PostgreSQL host                             |
| DB_PORT        | 5432                            | PostgreSQL port                             |
| DB_USERNAME    | postgres                        | Database user                               |
| DB_PASSWORD    | postgres                        | Database password                           |
| DB_NAME        | grocery_db                      | Database name                               |
| JWT_SECRET     | change-me-in-production         | JWT signing secret                          |
| JWT_EXPIRES_IN | 1d                              | Token expiry                                |
| ADMIN_SECRET   | change-this-admin-secret        | Header secret required to register as admin |

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

## Usage — End-to-End API Flow

A complete walkthrough using `curl`. All responses are wrapped in `{ success, data, timestamp }`.

---

### Step 1 — Register an admin account

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "X-Admin-Secret: change-this-admin-secret" \
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "password123"
  }'
```

```json
{
  "success": true,
  "data": {
    "accessToken": "<ADMIN_JWT>",
    "user": { "id": 1, "name": "Admin", "email": "admin@example.com", "role": "admin" }
  }
}
```

> Save the `accessToken` — you'll use it as `<ADMIN_JWT>` in the admin steps below.

---

### Step 2 — Register a regular user

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123"
  }'
```

```json
{
  "success": true,
  "data": {
    "accessToken": "<USER_JWT>",
    "user": { "id": 2, "name": "Jane Doe", "email": "jane@example.com", "role": "user" }
  }
}
```

> Save this token as `<USER_JWT>`.

---

### Step 3 — Log in (returning user)

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

```json
{
  "success": true,
  "data": {
    "accessToken": "<USER_JWT>",
    "user": { "id": 2, "name": "Jane Doe", "email": "jane@example.com", "role": "user" }
  }
}
```

---

### Step 4 — Add grocery items (admin only)

```bash
curl -X POST http://localhost:3000/api/v1/groceries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_JWT>" \
  -d '{
    "name": "Organic Apples",
    "price": 4.99,
    "description": "Fresh organic apples",
    "inventory": 100
  }'
```

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Organic Apples",
    "price": "4.99",
    "description": "Fresh organic apples",
    "inventory": 100,
    "isAvailable": true
  }
}
```

Repeat for more items — e.g. add Whole Milk (`id: 2`) and Sourdough Bread (`id: 3`).

---

### Step 5 — Update inventory (admin only)

```bash
curl -X PATCH http://localhost:3000/api/v1/groceries/1/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_JWT>" \
  -d '{ "inventory": 50 }'
```

Setting inventory to `0` automatically marks the item as unavailable.

---

### Step 6 — Browse grocery items (public)

```bash
curl http://localhost:3000/api/v1/groceries
```

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Organic Apples",  "price": "4.99", "inventory": 50, "isAvailable": true },
    { "id": 2, "name": "Whole Milk",      "price": "1.99", "inventory": 80, "isAvailable": true },
    { "id": 3, "name": "Sourdough Bread", "price": "3.49", "inventory": 30, "isAvailable": true }
  ]
}
```

---

### Step 7 — Place an order (authenticated user)

Order multiple items in a single request:

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <USER_JWT>" \
  -d '{
    "items": [
      { "groceryId": 1, "quantity": 2 },
      { "groceryId": 3, "quantity": 1 }
    ]
  }'
```

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 2,
    "status": "pending",
    "totalAmount": "13.47",
    "items": [
      { "groceryId": 1, "quantity": 2, "unitPrice": "4.99" },
      { "groceryId": 3, "quantity": 1, "unitPrice": "3.49" }
    ]
  }
}
```

Inventory is decremented atomically — if any item is out of stock the entire order is rolled back with a `400` error.

---

### Step 8 — View your orders

```bash
# All orders for the current user
curl http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer <USER_JWT>"

# Single order with full grocery details
curl http://localhost:3000/api/v1/orders/1 \
  -H "Authorization: Bearer <USER_JWT>"
```

---

### Step 9 — View your profile

```bash
curl http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer <USER_JWT>"
```
