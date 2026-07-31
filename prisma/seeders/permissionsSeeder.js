import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
import { PERMISSIONS_V2 } from "../../src/Constants/permissions.constants.js";

dotenv.config();

/**
 * Maps action string to HTTP method.
 */
const mapActionToMethod = (action) => {
  switch (action.toLowerCase()) {
    case "read":
      return "GET";
    case "create":
    case "assign":
      return "POST";
    case "update":
      return "PATCH";
    case "delete":
      return "DELETE";
    default:
      return "GET";
  }
};

/**
 * Format permission code into human-readable name.
 * e.g., "users:read" -> "Read Users"
 */
const formatPermissionName = (code) => {
  const [resource, action] = code.split(":");
  if (!resource || !action) return code;

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  return `${capitalize(action)} ${capitalize(resource)}`;
};

/**
 * Flatten PERMISSIONS_V2 object into array of permission codes.
 */
const extractPermissionCodes = (obj) => {
  const codes = [];
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      codes.push(obj[key]);
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      codes.push(...extractPermissionCodes(obj[key]));
    }
  }
  return [...new Set(codes)];
};

export const seedPermissions = async (prismaClient) => {
  let db = prismaClient;
  let pool = null;

  if (!db) {
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    db = new PrismaClient({ adapter });
  }

  console.log("🌱 Seeding permissions...");

  const codes = extractPermissionCodes(PERMISSIONS_V2);

  for (const code of codes) {
    const [resource, action] = code.split(":");
    const method = mapActionToMethod(action || "read");
    const name = formatPermissionName(code);

    await db.permission.upsert({
      where: { code },
      update: {
        name,
        resource: resource || "",
        method,
      },
      create: {
        code,
        name,
        resource: resource || "",
        method,
      },
    });
  }

  console.log(`✅ ${codes.length} Permissions seeded successfully.`);

  if (pool) {
    await db.$disconnect();
    await pool.end();
  }
};

// Allow standalone execution: node prisma/seeders/permissionsSeeder.js
if (process.argv[1] && process.argv[1].includes("permissionsSeeder.js")) {
  seedPermissions().catch((err) => {
    console.error("❌ Permissions Seeding Failed:", err);
    process.exit(1);
  });
}
