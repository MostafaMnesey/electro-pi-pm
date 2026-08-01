import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import dotenv from "dotenv";
dotenv.config();

import * as db from "../src/database/dbService.js";
import {
  createProjectService,
  getProjectBySlugService,
  addMembersService,
  removeMembersService,
  deleteProjectService,
} from "../src/modules/project/project.service.js";
import { MESSAGES } from "../src/Constants/messages.constants.js";

describe("Project Module Automated Tests", () => {
  let ownerUser;
  let memberUser;
  let createdProject;
  const timestamp = Date.now();
  const projectName = `Project Test ${timestamp}`;
  const projectSlug = `project-test-${timestamp}`;

  before(async () => {
    const adminRole = await db.findOne({
      model: "role",
      where: { name: "admin" },
    });
    const memberRole = await db.findOne({
      model: "role",
      where: { name: "member" },
    });

    ownerUser = await db.create({
      model: "user",
      data: {
        name: "Project Owner",
        email: `projowner_${timestamp}@test.com`,
        approved: true,
        active: true,
        roleId: adminRole?.id || null,
      },
    });

    memberUser = await db.create({
      model: "user",
      data: {
        name: "Project Member",
        email: `projmember_${timestamp}@test.com`,
        approved: true,
        active: true,
        roleId: memberRole?.id || null,
      },
    });
  });

  after(async () => {
    if (createdProject?.id) {
      await db.deleteOne({ model: "Project", where: { id: createdProject.id } }).catch(() => {});
    }
    const userIds = [ownerUser?.id, memberUser?.id].filter(Boolean);
    for (const uid of userIds) {
      await db.deleteOne({ model: "user", where: { id: uid } }).catch(() => {});
    }
  });

  it("1. Create Project - Success", async () => {
    const req = {
      user: ownerUser,
      body: {
        name: projectName,
        description: "Test project description",
        members: [],
      },
    };

    createdProject = await createProjectService(req);
    assert.ok(createdProject.id);
    assert.equal(createdProject.slug, projectSlug);
  });

  it("2. Create Project - Fail on Duplicate Name/Slug (expects 400)", async () => {
    const req = {
      user: ownerUser,
      body: {
        name: projectName,
        description: "Duplicate test",
      },
    };

    try {
      await createProjectService(req);
      assert.fail("Expected 400 error for duplicate project name but succeeded");
    } catch (err) {
      assert.equal(err.cause, 400);
      assert.equal(err.message, MESSAGES.PROJECT_ALREADY_EXISTS);
    }
  });

  it("3. Get Project By Slug - Successfully retrieve project details", async () => {
    const req = { params: { slug: projectSlug } };
    const project = await getProjectBySlugService(req);
    assert.equal(project.id, createdProject.id);
    assert.equal(project.name, projectName);
  });

  it("4. Add Member - Successfully add member to project", async () => {
    const req = {
      params: { id: createdProject.id },
      body: { userIds: [memberUser.id] },
    };

    const result = await addMembersService(req);
    assert.ok(result.count >= 1);
  });

  it("5. Remove Member - Successfully remove member from project", async () => {
    const req = {
      params: { id: createdProject.id },
      body: { userIds: [memberUser.id] },
    };

    const result = await removeMembersService(req);
    assert.ok(result.removed.count >= 1);
  });

  it("6. Delete Project - Successfully delete project", async () => {
    const req = { params: { id: createdProject.id } };
    const deleted = await deleteProjectService(req);
    assert.equal(deleted.id, createdProject.id);
    createdProject = null; // reset so cleanup doesn't fail
  });
});
