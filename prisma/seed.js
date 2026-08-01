import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
import { seedPermissions } from "./seeders/permissionsSeeder.js";
import { seedRoles } from "./seeders/roles.seeder.js";
import { seedUsers } from "./seeders/user.seeder.js";
import { seedProjects } from "./seeders/project.seeder.js";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("--- Starting Global Seeding ---");
  await seedPermissions(prisma);
  await seedRoles(prisma);
  await seedUsers(prisma);
  await seedProjects(prisma);
  console.log("--- Seeding Finished Successfully ---");
}

main()
  .catch((e) => {
    console.error("❌ Global Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
