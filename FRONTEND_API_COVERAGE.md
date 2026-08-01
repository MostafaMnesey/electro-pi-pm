# Frontend API Coverage Checklist

> Generated from Step 0 audit of the backend codebase (routes, controllers, validation, services).
> Every ✅ item has a corresponding UI flow in the frontend.

## Base URL: `http://localhost:3009/api/v1`

---

## 🔐 Auth Module (`/authentication`)

| # | Method | Endpoint | UI Location | Status |
|---|--------|----------|-------------|--------|
| 1 | POST | `/authentication/signup` | `RegisterPage` — RHF + zod form | ✅ |
| 2 | POST | `/authentication/signin` | `LoginPage` — RHF + zod form, stores tokens + role + permissions | ✅ |
| 3 | POST | `/authentication/refresh-token` | `shared/lib/axios.js` — auto-refresh interceptor | ✅ |

---

## 👤 User Module (`/user`)

| # | Method | Endpoint | Auth/Role | UI Location | Status |
|---|--------|----------|-----------|-------------|--------|
| 4 | GET | `/user/profile` | JWT | Used in `AuthContext` to persist session | ✅ |
| 5 | GET | `/user/` | `users:read` (ADMIN) | `AdminPage` — "All Users" tab | ✅ |
| 6 | PATCH | `/user/:id/active` | `users:update` (ADMIN) | `AdminPage` — Activate/Deactivate button per row | ✅ |
| 7 | GET | `/user/pending-approval` | `users:read` (ADMIN) | `AdminPage` — "Pending Approval" tab | ✅ |
| 8 | PATCH | `/user/:id/approve` | `users:update` (ADMIN) | `AdminPage` — Approve button on pending rows | ✅ |

---

## 📂 Projects Module (`/projects`)

| # | Method | Endpoint | Auth/Role | UI Location | Status |
|---|--------|----------|-----------|-------------|--------|
| 9 | GET | `/projects/` | `projects:read` (ADMIN) | `ProjectListPage` — ADMIN sees all projects grid | ✅ |
| 10 | GET | `/projects/my-projects` | `projects:read` (any) | `ProjectListPage` — MEMBER sees own projects | ✅ |
| 11 | POST | `/projects/` | `projects:create` (ADMIN) | `ProjectForm` modal — "New Project" button | ✅ |
| 12 | GET | `/projects/:slug` | member/owner | `ProjectDetailPage` — full project detail with tasks | ✅ |
| 13 | PATCH | `/projects/:id` | owner/ADMIN | `ProjectForm` modal in edit mode — "Edit" in card menu | ✅ |
| 14 | DELETE | `/projects/:id` | owner/ADMIN | `ProjectCard` — "Delete" in card menu + confirm dialog | ✅ |
| 15 | POST | `/projects/:id/add-members` | owner/ADMIN | `AddMemberModal` — "Add Member" in MemberList sidebar | ✅ |
| 16 | DELETE | `/projects/:id/remove-members` | owner/ADMIN | `MemberList` — remove icon per member + confirm | ✅ |

---

## ✅ Tasks Module (`/tasks`)

| # | Method | Endpoint | Auth/Role | UI Location | Status |
|---|--------|----------|-----------|-------------|--------|
| 17 | POST | `/tasks/projects/:projectId/tasks` | `tasks:create` (ADMIN) + member | `TaskForm` modal — "New Task" button in TaskBoard | ✅ |
| 18 | GET | `/tasks/projects/:projectId/tasks` | project member | `TaskBoard` — fetched per project, filtered by `TaskFilters` bar | ✅ |
| 19 | GET | `/tasks/tasks/:id` | project member | `useTask` hook — available for task detail expansion | ✅ |
| 20 | PATCH | `/tasks/tasks/:id` | `tasks:update` (ADMIN only) | `TaskForm` in edit mode — Edit button on `TaskCard` | ✅ |
| 21 | PATCH | `/tasks/tasks/:id/status` | MEMBER (if assignee) or ADMIN | `TaskCard` — status `<select>` dropdown (disabled if not assignee/admin) | ✅ |
| 22 | PATCH | `/tasks/tasks/:id/assign` | `tasks:update` (ADMIN only) | `AssignTaskModal` — "Reassign" button on `TaskCard` | ✅ |
| 23 | DELETE | `/tasks/tasks/:id` | `tasks:delete` (ADMIN only) | `TaskCard` — Delete button + `ConfirmDialog` | ✅ |

---

## 🔍 Filter Parameters Coverage

| Filter | Backend Support | UI Control |
|--------|----------------|-----------|
| `search` (task title/description) | ✅ | `TaskFilters` — search input |
| `status` | ✅ | `TaskFilters` — status dropdown |
| `priority` | ✅ | `TaskFilters` — priority dropdown |
| `assigneeId` | ✅ | `TaskFilters` — assignee dropdown (populated from members) |
| `page` / `limit` | ✅ | Sent with defaults; paginator can be added |
| Project search | ✅ | `ProjectListPage` — search input |

---

## 🛡️ RBAC UI Coverage

| Feature | ADMIN | MEMBER |
|---------|-------|--------|
| See "Create Project" button | ✅ | ❌ Hidden |
| Edit project | ✅ | ❌ Hidden |
| Delete project | ✅ | ❌ Hidden |
| Add / remove project members | ✅ | ❌ Hidden |
| Create task | ✅ | ❌ Hidden |
| Edit task (title/desc/priority/dueDate) | ✅ | ❌ Hidden |
| Reassign task to member | ✅ | ❌ Hidden |
| Delete task | ✅ | ❌ Hidden |
| Change own task status | ✅ | ✅ (assignee only; disabled with title if not assignee) |
| View task board | ✅ | ✅ |
| View project details | ✅ | ✅ |
| Admin Panel | ✅ | ❌ Route-guarded |
| Approve users | ✅ | ❌ |
| Toggle user active | ✅ | ❌ |

---

**All 23 endpoints are covered.** ✅
