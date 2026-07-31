import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
import { ROLES } from "../../src/Utils/Permissions/permissions.js";
import { PERMISSIONS_V2 } from "../../src/Constants/permissions.constants.js";

dotenv.config();

export const seedRoles = async (prismaClient) => {
  let db = prismaClient;
  let pool = null;

  if (!db) {
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    db = new PrismaClient({ adapter });
  }

  console.log("🌱 Seeding roles & role permissions...");

  const roleNames = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MEMBER];

  // 1. Ensure all roles exist
  const roleMap = {};
  for (const name of roleNames) {
    const roleRecord = await db.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    roleMap[name] = roleRecord;
  }

  // 2. Fetch all permissions from DB
  const allPermissions = await db.permission.findMany();
  const permCodeToId = {};
  allPermissions.forEach((p) => {
    if (p.code) permCodeToId[p.code] = p.id;
  });

  // 3. Define permission mapping per role
  const rolePermissionCodes = {
    [ROLES.SUPER_ADMIN]: allPermissions.map((p) => p.code).filter(Boolean),
    [ROLES.ADMIN]: allPermissions.map((p) => p.code).filter(Boolean),
    [ROLES.MEMBER]: [
      PERMISSIONS_V2.PROJECTS?.READ,
      PERMISSIONS_V2.TASKS?.READ,
      PERMISSIONS_V2.TASKS?.CREATE,
      PERMISSIONS_V2.TASKS?.UPDATE,
      PERMISSIONS_V2.TEAMS?.READ,
      PERMISSIONS_V2.SETTINGS?.READ,
    ].filter(Boolean),
  };

  // 4. Assign permissions to roles
  for (const roleName of roleNames) {
    const role = roleMap[roleName];
    if (!role) continue;

    const targetCodes = rolePermissionCodes[roleName] || [];

    for (const code of targetCodes) {
      const permissionId = permCodeToId[code];
      if (!permissionId) continue;

      await db.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permissionId,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permissionId,
        },
      });
    }
  }

  console.log(`✅ Roles (${roleNames.join(", ")}) and role permissions seeded successfully.`);

  if (pool) {
    await db.$disconnect();
    await pool.end();
  }
};

// Allow standalone execution: node prisma/seeders/roles.seeder.js
if (process.argv[1] && process.argv[1].includes("roles.seeder.js")) {
  seedRoles().catch((err) => {
    console.error("❌ Roles Seeding Failed:", err);
    process.exit(1);
  });
}
