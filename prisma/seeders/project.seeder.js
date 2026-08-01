import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

export const seedProjects = async (prismaClient) => {
  let db = prismaClient;
  let pool = null;

  if (!db) {
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    db = new PrismaClient({ adapter });
  }

  console.log("🌱 Seeding sample project and tasks...");

  const adminUser = await db.user.findFirst({
    where: { email: "admin@pm.com" },
  });

  const memberUser = await db.user.findFirst({
    where: { email: "member@pm.com" },
  });

  if (!adminUser || !memberUser) {
    console.log("⚠️ Admin or Member user not found, skipping project seeding.");
    return;
  }

  const projectSlug = "sample-project";

  const project = await db.project.upsert({
    where: { slug: projectSlug },
    update: {
      name: "Sample Project",
      description: "A sample project seeded for testing Admin and Member workflows.",
    },
    create: {
      name: "Sample Project",
      slug: projectSlug,
      description: "A sample project seeded for testing Admin and Member workflows.",
      ownerId: adminUser.id,
      members: {
        create: [
          { userId: adminUser.id },
          { userId: memberUser.id },
        ],
      },
      tasks: {
        create: [
          {
            title: "Setup Backend Architecture",
            description: "Initialize Express app, Prisma ORM, and RBAC authentication.",
            status: "DONE",
            priority: "HIGH",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            creatorId: adminUser.id,
            assigneeId: adminUser.id,
          },
          {
            title: "Implement Task Management Endpoints",
            description: "Build endpoints for creating, updating, and assigning tasks.",
            status: "IN_PROGRESS",
            priority: "HIGH",
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            creatorId: adminUser.id,
            assigneeId: memberUser.id,
          },
          {
            title: "Frontend UI Integration",
            description: "Connect React frontend with backend REST API.",
            status: "TODO",
            priority: "MEDIUM",
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            creatorId: adminUser.id,
            assigneeId: memberUser.id,
          },
        ],
      },
    },
  });

  console.log(`✅ Sample Project "${project.name}" seeded with members (Admin & Member) and initial tasks.`);

  if (pool) {
    await db.$disconnect();
    await pool.end();
  }
};

if (process.argv[1] && process.argv[1].includes("project.seeder.js")) {
  seedProjects().catch((err) => {
    console.error("❌ Project Seeding Failed:", err);
    process.exit(1);
  });
}
