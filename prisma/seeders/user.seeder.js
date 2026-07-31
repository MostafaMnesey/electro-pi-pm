import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { mainRoles } from "../../src/Utils/Enums/roles.js";

dotenv.config();

export const seedUsers = async (prismaClient) => {
  let db = prismaClient;
  let pool = null;

  if (!db) {
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    db = new PrismaClient({ adapter });
  }

  console.log("🌱 Seeding default users...");

  // Fetch roles
  const roles = await db.role.findMany();
  const roleMap = {};
  roles.forEach((r) => {
    roleMap[r.name] = r.id;
  });

  const saltRounds = Number(process.env.SALT) || 10;
  const defaultPassword = await bcrypt.hash("Password123!", saltRounds);

  const initialUsers = [
    {
      name: "Super Admin",
      email: "superadmin@pm.com",
      phone: "+201000000001",
      password: defaultPassword,
      approved: true,
      roleId: roleMap[mainRoles.SUPER_ADMIN] || null,
    },
    {
      name: "System Admin",
      email: "admin@pm.com",
      phone: "+201000000002",
      password: defaultPassword,
      approved: true,
      roleId: roleMap[mainRoles.ADMIN] || null,
    },
    {
      name: "Test Member",
      email: "member@pm.com",
      phone: "+201000000003",
      password: defaultPassword,
      approved: true,
      roleId: roleMap[mainRoles.MEMBER] || null,
    },
  ];

  for (const userData of initialUsers) {
    await db.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        phone: userData.phone,
        approved: userData.approved,
        roleId: userData.roleId,
      },
      create: userData,
    });
  }

  console.log(`✅ ${initialUsers.length} Users seeded successfully (Default password: Password123!).`);

  if (pool) {
    await db.$disconnect();
    await pool.end();
  }
};

// Allow standalone execution: node prisma/seeders/user.seeder.js
if (process.argv[1] && process.argv[1].includes("user.seeder.js")) {
  seedUsers().catch((err) => {
    console.error("❌ Users Seeding Failed:", err);
    process.exit(1);
  });
}
