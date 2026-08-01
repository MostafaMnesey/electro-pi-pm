/**
 * Centralized Permission Constants
 * Format: resource:action
 */

export const PERMISSIONS_V2 = {
  USERS: {
    READ: "users:read",
    CREATE: "users:create",
    UPDATE: "users:update",
    DELETE: "users:delete",
  },

  ROLES: {
    READ: "roles:read",
    CREATE: "roles:create",
    UPDATE: "roles:update",
    DELETE: "roles:delete",
    ASSIGN: "roles:assign",
  },

  PERMISSIONS: {
    READ: "permissions:read",
    CREATE: "permissions:create",
    UPDATE: "permissions:update",
    DELETE: "permissions:delete",
  },

  PROJECTS: {
    READ: "projects:read",
    CREATE: "projects:create",
    UPDATE: "projects:update",
    DELETE: "projects:delete",
  },

  TASKS: {
    READ: "tasks:read",
    CREATE: "tasks:create",
    UPDATE: "tasks:update",
    DELETE: "tasks:delete",
  },

  TEAMS: {
    READ: "teams:read",
    CREATE: "teams:create",
    UPDATE: "teams:update",
    DELETE: "teams:delete",
  },

  SETTINGS: {
    READ: "settings:read",
    UPDATE: "settings:update",
  },
};

