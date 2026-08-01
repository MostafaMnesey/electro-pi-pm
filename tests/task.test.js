import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import dotenv from "dotenv";
dotenv.config();

import * as db from "../src/database/dbService.js";
import {
  updateTaskStatusService,
  assignTaskService,
} from "../src/modules/task/task.service.js";
import { MESSAGES } from "../src/Constants/messages.constants.js";

describe("Task Module Automated Tests", () => {
  let adminUser;
  let member1User;
  let member2User;
  let nonMemberUser;
  let project;
  let task;

  before(async () => {
    // 1. Fetch roles
    const adminRole = await db.findOne({
      model: "role",
      where: { name: "admin" },
    });
    const memberRole = await db.findOne({
      model: "role",
      where: { name: "member" },
    });

    // 2. Create test users
    const timestamp = Date.now();
    adminUser = await db.create({
      model: "user",
      data: {
        name: "Test Admin",
        email: `admin_${timestamp}@test.com`,
        approved: true,
        active: true,
        roleId: adminRole?.id || null,
      },
      include: { role: true },
    });

    member1User = await db.create({
      model: "user",
      data: {
        name: "Test Member 1",
        email: `member1_${timestamp}@test.com`,
        approved: true,
        active: true,
        roleId: memberRole?.id || null,
      },
      include: { role: true },
    });

    member2User = await db.create({
      model: "user",
      data: {
        name: "Test Member 2",
        email: `member2_${timestamp}@test.com`,
        approved: true,
        active: true,
        roleId: memberRole?.id || null,
      },
      include: { role: true },
    });

    nonMemberUser = await db.create({
      model: "user",
      data: {
        name: "Test Non Member",
        email: `nonmember_${timestamp}@test.com`,
        approved: true,
        active: true,
        roleId: memberRole?.id || null,
      },
      include: { role: true },
    });

    // 3. Create test project with member1User and member2User
    project = await db.create({
      model: "Project",
      data: {
        name: `Test Project ${timestamp}`,
        slug: `test-project-${timestamp}`,
        ownerId: adminUser.id,
        members: {
          create: [
            { userId: member1User.id },
            { userId: member2User.id },
          ],
        },
      },
    });

    // 4. Create test task assigned to member1User
    task = await db.create({
      model: "Task",
      data: {
        title: "Initial Test Task",
        description: "Task for automated testing",
        priority: "MEDIUM",
        status: "TODO",
        dueDate: new Date(Date.now() + 86400000), // tomorrow
        creatorId: adminUser.id,
        assigneeId: member1User.id,
        projectId: project.id,
      },
    });
  });

  after(async () => {
    // Cleanup test data
    if (task?.id) {
      await db.deleteOne({ model: "Task", where: { id: task.id } }).catch(() => {});
    }
    if (project?.id) {
      await db.deleteOne({ model: "Project", where: { id: project.id } }).catch(() => {});
    }
    const userIds = [adminUser?.id, member1User?.id, member2User?.id, nonMemberUser?.id].filter(Boolean);
    for (const uid of userIds) {
      await db.deleteOne({ model: "user", where: { id: uid } }).catch(() => {});
    }
  });

  it("1. MEMBER cannot update status of a task they are not assigned to (expects 403)", async () => {
    const req = {
      params: { id: task.id },
      body: { status: "IN_PROGRESS" },
      user: member2User, // member2 is not assignee
    };

    try {
      await updateTaskStatusService(req);
      assert.fail("Expected 403 error but function succeeded");
    } catch (err) {
      assert.equal(err.cause, 403);
      assert.equal(err.message, MESSAGES.NOT_TASK_ASSIGNEE);
    }
  });

  it("2. MEMBER can successfully update status of their own assigned task", async () => {
    const req = {
      params: { id: task.id },
      body: { status: "DONE" },
      user: member1User, // member1 IS the assignee
    };

    const updatedTask = await updateTaskStatusService(req);
    assert.equal(updatedTask.status, "DONE");
    assert.equal(updatedTask.id, task.id);
  });

  it("3a. ADMIN can successfully assign a task to a valid project member", async () => {
    const req = {
      params: { id: task.id },
      body: { assigneeId: member2User.id }, // member2 is in project
      user: adminUser,
    };

    const updatedTask = await assignTaskService(req);
    assert.equal(updatedTask.assigneeId, member2User.id);
  });

  it("3b. ADMIN assigning task to a non-member returns 400 Bad Request", async () => {
    const req = {
      params: { id: task.id },
      body: { assigneeId: nonMemberUser.id }, // nonMember is NOT in project
      user: adminUser,
    };

    try {
      await assignTaskService(req);
      assert.fail("Expected 400 error but function succeeded");
    } catch (err) {
      assert.equal(err.cause, 400);
      assert.equal(err.message, MESSAGES.NOT_PROJECT_MEMBER);
    }
  });
});
