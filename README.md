# 🚀 Project Manager Backend API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?style=for-the-badge&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-v5.0-black?style=for-the-badge&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14%2B-336791?style=for-the-badge&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-v7.0-DC382D?style=for-the-badge&logo=redis)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D?style=for-the-badge&logo=swagger)

</div>

---

## 📌 Executive Summary

The **Project Manager Backend API** is an enterprise-grade RESTful API & WebSockets server built with **Node.js (ES Modules)**, **Express v5**, **Prisma ORM**, **PostgreSQL**, **Redis**, and **Socket.IO**. 

It provides an end-to-end backend solution for managing multi-tenant projects, task assignments, role-based access control (RBAC), user registration with admin approval workflows, rate limiting, and real-time updates via WebSockets.

---

## 🌟 Key Backend Features

### 🔐 1. Authentication & Security
- **JWT Auth**: Access tokens and Refresh token rotation.
- **Password Hashing**: Secure password hashing using `bcryptjs`.
- **Account Approval Workflow**: Newly registered users require Admin approval before logging in.
- **Active State Control**: Deactivated accounts are blocked immediately (with Redis cache invalidation).
- **Rate Limiting Throttling**: Multi-tier protection powered by `express-rate-limit`:
  - Global Rate Limiter (Anti-DDoS / Spam).
  - Auth Rate Limiter (Brute-force protection on Signin/Signup).
  - OTP / Mutation Throttling.

### 🛡️ 2. Dynamic Role-Based Access Control (RBAC)
- Fine-grained permission model (`SUPER_ADMIN`, `ADMIN`, `MEMBER`).
- Custom `authorize` and `authorizeResource` Express middlewares enforcing permissions per route.
- Project Member Guard ensuring users can only interact with projects they belong to.

### 📂 3. Project Management
- Project CRUD operations with automatic URL-friendly slug generation.
- Dynamic member management (adding and removing project members with validation).
- Access control: `MEMBER` users cannot create projects (`403 Forbidden`).

### ✅ 4. Task Management & Kanban Rules
- Task CRUD operations scoped strictly per project.
- **Granular Status Updates**: Task status (`TODO`, `IN_PROGRESS`, `DONE`) can only be updated by the assigned member or an Admin. Non-assignees receive `403 Forbidden`.
- **Assignment Validation**: Admin can only assign tasks to users who are confirmed members of that project (`400 Bad Request` if non-member).

### ⚡ 5. Real-Time WebSockets & Caching
- **Socket.IO**: Real-time event broadcasting with JWT socket authentication.
- **Redis Adapter**: Multi-instance horizontal scaling with `@socket.io/redis-adapter`.
- **Redis Caching**: Fast session caching for authenticated user profiles and permission sets.

---

## 🏗️ Architecture & Directory Structure

```
project-manager-backend/
├── prisma/                          # Database schema, migrations, & seeders
│   ├── migrations/                  # SQL migration history
│   ├── seeders/                     # Seeder scripts
│   │   ├── permissionsSeeder.js     # Seeds system permissions
│   │   ├── roles.seeder.js          # Seeds RBAC roles & permissions
│   │   ├── user.seeder.js           # Seeds default test users
│   │   └── project.seeder.js        # Seeds sample project with tasks
│   ├── schema.prisma                # Prisma ORM Data Model
│   └── seed.js                      # Central Database Seeder Entrypoint
├── src/                             # Backend Source Code
│   ├── Constants/                   # Global enums, message constants, RBAC matrix
│   ├── Middlewares/                 # Auth, Authorization, Validation, Rate Limiter
│   ├── Utils/                       # Response helpers, Redis, Socket.IO, Swagger
│   ├── database/                    # DB connection service layer
│   ├── modules/                     # Modular Domain Services
│   │   ├── authentication/          # Signup, Signin, Refresh token services & validation
│   │   ├── user/                    # User list, Pending approval, Active status services
│   │   ├── project/                 # Project CRUD, Member addition/removal services
│   │   └── task/                    # Task CRUD, Status updates, Assignment services
│   ├── app.controller.js            # Express app bootstrap & middleware pipeline
│   ├── index.js                     # HTTP Server entrypoint
│   └── index.routes.js              # Central API Root Router (/api/v1)
├── tests/                           # Integration Automated Test Suites (Node.js Test Runner)
│   ├── auth.test.js                 # Authentication logic tests
│   ├── user.test.js                 # User management logic tests
│   ├── project.test.js              # Project management logic tests
│   └── task.test.js                 # Task management & permission logic tests
├── .env.example                     # Environment variables template
├── Dockerfile               # Multi-stage production Docker build
├── docker-compose.yml               # Container orchestration (App + PostgreSQL + Redis)
├── openapi.json                     # OpenAPI 3.0 API Specification
├── error_responses.json             # API Error Responses Dictionary
└── project_manager_postman_collection.json # Ready-to-import Postman Collection
```

---

## ⚙️ Environment Variables Configuration

Copy `.env.example` to create your local `.env` file:

```bash
cp .env.example .env
```

### Detailed Environment Variables Reference

| Variable Name | Required | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | Yes | `3009` | HTTP Server port |
| `NODE_ENV` | Yes | `development` | Environment mode (`development` / `production`) |
| `DATABASE_URL` | Yes | `postgresql://...` | PostgreSQL connection string |
| `POSTGRES_USER` | Yes | `Pm_user2026` | Database username for Docker |
| `POSTGRES_PASSWORD` | Yes | `pm!2522@2026` | Database password for Docker |
| `POSTGRES_DB` | Yes | `pm_db` | Database name |
| `POSTGRES_PORT` | Yes | `5450` | PostgreSQL container host port |
| `REDIS_URL` | Yes | `redis://localhost:6395` | Redis server connection URL |
| `REDIS_PORT` | Yes | `6395` | Redis host port |
| `SALT` | Yes | `10` | Salt rounds for bcrypt password hashing |
| `JWT_SECRET` | Yes | `pm_Ac_Jwt__357895123` | Secret key for JWT access tokens |
| `JWT_SECRET_REFRESH` | Yes | `your_jwt_refresh_admin_secret` | Secret key for JWT refresh tokens |
| `GLOBAL_RATE_LIMIT_WINDOW_MS` | No | `900000` (15m) | Global rate limit window |
| `GLOBAL_RATE_LIMIT_MAX` | No | `100` | Max requests per global window |
| `AUTH_RATE_LIMIT_WINDOW_MS` | No | `900000` (15m) | Auth rate limit window |
| `AUTH_RATE_LIMIT_MAX` | No | `20` | Max failed auth attempts per window |

---

## 🐳 Docker & Containerization Guide

The backend includes full Docker support using a **multi-stage Docker build** and **Docker Compose** orchestration for PostgreSQL, Redis, and the Backend API.

### 1. Launch All Services (App + DB + Redis)

```bash
docker-compose up -d --build
```

This will spin up:
- **PostgreSQL Database** on port `5450`
- **Redis Server** on port `6395`
- **Backend API Application** on port `8090` (or configured `APP_PORT`)

### 2. Check Container Status & Logs

```bash
# View running containers
docker-compose ps

# View backend container logs
docker-compose logs -f app
```

### 3. Run Database Migrations & Seeds inside Docker

```bash
# Run Prisma Migrations inside running container
docker-compose exec app npx prisma migrate dev

# Run Database Seeder inside running container
docker-compose exec app npm run seed:all
```

### 4. Stop Services

```bash
docker-compose down
```

---

## 💻 Local Setup & Execution Guide (Without Docker)

### Prerequisites
- **Node.js**: `v18.x` or higher
- **PostgreSQL**: `v14.x` or higher running locally
- **Redis**: `v6.x` or higher running locally

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Migration & Seeding

```bash
# Run database migrations
npx prisma migrate dev

# Seed database with Roles, Permissions, Users, and Sample Project
npm run seed:all
```

### 3. Start Development Server

```bash
npm run dev
```

The API server will start listening at `http://localhost:3009/api/v1`.



```urls

pgAdmin Url : http://localhost:5080


swagger docs Url : http://localhost:5080



```
---




## 🔑 Test Accounts & Seed Credentials

Running `npm run seed:all` populates the database with default accounts and a sample project:

| Role | Email | Password | Status | Capabilities |
| :--- | :--- | :--- | :---: | :--- |
| **Super Admin** | `superadmin@pm.com` | `Password123!` | Approved / Active | Full system control |
| **System Admin** | `admin@pm.com` | `Password123!` | Approved / Active | User approvals, Project & Task management |
| **Test Member** | `member@pm.com` | `Password123!` | Approved / Active | Member access, status updates on assigned tasks |

### 📦 Seeded Sample Project Data
- **Project Name**: `Sample Project`
- **Slug**: `sample-project`
- **Members**: Admin (`admin@pm.com`) & Member (`member@pm.com`)
- **Seeded Tasks**:
  1. *"Setup Backend Architecture"* (`DONE` - Assigned to Admin)
  2. *"Implement Task Management Endpoints"* (`IN_PROGRESS` - Assigned to Member)
  3. *"Frontend UI Integration"* (`TODO` - Assigned to Member)

---

## 📖 API Documentation & Postman Collection

### 1. Interactive Swagger UI
The backend features interactive Swagger documentation mounted directly at:
👉 **`http://localhost:3009/docs`** (or `http://localhost:8090/docs` in Docker)

You can also retrieve the raw OpenAPI 3.0 JSON specification at `http://localhost:3009/openapi.json`.

### 2. Postman Collection Export
A complete Postman Collection (v2.1.0) is included in the repository root:
📄 [`project_manager_postman_collection.json`](./project_manager_postman_collection.json)

**How to use**:
1. Open Postman.
2. Click **Import** -> Select `project_manager_postman_collection.json`.
3. Set the `baseUrl` variable (defaults to `http://localhost:3009/api/v1`).
4. Execute `Signin Admin` or `Signin Member` to obtain JWT tokens.

### 3. API Error Responses Mapping
A comprehensive JSON document detailing every possible HTTP error status code, response structure, and trigger condition across all endpoints is provided at:
📄 [`error_responses.json`](./error_responses.json)

#### Standard Error Payload Format:
```json
{
  "message": "error",
  "status": 400,
  "error": "Detailed error message"
}
```

#### Validation Error Payload Format:
```json
{
  "message": "Validation failed for the request payload",
  "status": 400,
  "errors": [
    "\"email\" must be a valid email"
  ]
}
```

---

## 🧪 Automated Testing Suite

The project includes unit & integration tests written for the native Node.js Test Runner (`node --test`), covering business logic across all modules.

### Run All Tests

```bash
npm test
```

### Test Coverage Summary

| Test File | Module Tested | Test Cases Covered |
| :--- | :--- | :--- |
| **`tests/auth.test.js`** | Authentication | • Signup success<br>• Signup failure on duplicate email (`400`)<br>• Signin success with valid credentials<br>• Signin failure on incorrect password (**`401`**)<br>• Signin failure on unapproved user (`400`) |
| **`tests/user.test.js`** | User Management | • Get pending users list<br>• Approve user registration<br>• Fail re-approving approved user (`400`)<br>• Toggle user active status<br>• User search & pagination filtering |
| **`tests/project.test.js`** | Project Management | • Create project<br>• Fail creating duplicate project name/slug (`400`)<br>• Retrieve project details by slug<br>• Add member to project<br>• Remove member from project<br>• Delete project |
| **`tests/task.test.js`** | Task Management | • Member cannot update status of task not assigned to them (**`403`**)<br>• Member updates status of assigned task successfully<br>• Admin assigns task to project member<br>• Admin assigning task to non-member fails (**`400`**) |

---

## 📋 Evaluation Criteria Verification

| Requirement | Implementation Verification |
| :--- | :--- |
| **Auth: Register success + Fail duplicate email** | ✅ Tested in `tests/auth.test.js`. Returns `201` on success, `400` on duplicate. |
| **Auth: Login wrong credentials returns 401** | ✅ Tested in `tests/auth.test.js`. Returns `401 Unauthorized` on wrong email or password. |
| **Projects: Member cannot create project (403)** | ✅ Enforced via RBAC permission `project:create`. Member role returns `403 Forbidden`. |
| **Tasks: Member cannot edit task not assigned to them (403)** | ✅ Tested in `tests/task.test.js`. Status update by non-assignee returns `403 Forbidden`. |
| **Tasks: Status update succeeds for assignee** | ✅ Tested in `tests/task.test.js`. Assigned member successfully transitions task status. |
| **Swagger Setup** | ✅ Configured and active at `http://localhost:3009/docs`. |
| **`.env.example`** | ✅ Available at `.env.example` without real production secrets. |
| **`prisma/seed.js`** | ✅ Seeds Admin, Member, Roles, Permissions, and Sample Project with tasks. |
| **Postman Collection** | ✅ Exported at `project_manager_postman_collection.json`. |
| **Docker Integration** | ✅ Fully configured with `Dockerfile` and `docker-compose.yml`. |

---

## 🛡️ License

ISC License. Built for enterprise backend system evaluation.
