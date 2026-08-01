import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import dotenv from "dotenv";
dotenv.config();

import * as db from "../src/database/dbService.js";
import {
  usersService,
  changeUserActiveStatusService,
  approveUserService,
  getAllUsersPendingService,
} from "../src/modules/user/user.service.js";
import { MESSAGES } from "../src/Constants/messages.constants.js";

describe("User Module Automated Tests", () => {
  let targetUser;

  before(async () => {
    const timestamp = Date.now();
    const memberRole = await db.findOne({
      model: "role",
      where: { name: "member" },
    });

    targetUser = await db.create({
      model: "user",
      data: {
        name: "User Management Test",
        email: `usertest_${timestamp}@test.com`,
        phone: "+201088887777",
        approved: false,
        active: true,
        roleId: memberRole?.id || null,
      },
    });
  });

  after(async () => {
    if (targetUser?.id) {
      await db.deleteOne({ model: "user", where: { id: targetUser.id } }).catch(() => {});
    }
  });

  it("1. Get Pending Users List - Target user exists in pending list", async () => {
    const req = { query: { page: 1, limit: 50 } };
    const pendingList = await getAllUsersPendingService(req);
    assert.ok(pendingList.data.length > 0);
    const found = pendingList.data.some((u) => u.id === targetUser.id);
    assert.ok(found, "Created pending user should be in pending list");
  });

  it("2. Approve User - Successfully approve pending user", async () => {
    const req = { params: { id: targetUser.id } };
    const updatedUser = await approveUserService(req);
    assert.equal(updatedUser.approved, true);
  });

  it("3. Approve User - Fail if user is already approved (expects 400)", async () => {
    const req = { params: { id: targetUser.id } };
    try {
      await approveUserService(req);
      assert.fail("Expected 400 error for re-approving user but succeeded");
    } catch (err) {
      assert.equal(err.cause, 400);
      assert.equal(err.message, MESSAGES.USER_ALREADY_APPROVED);
    }
  });

  it("4. Toggle Active Status - Successfully deactivate and reactivate user", async () => {
    const req = { params: { id: targetUser.id } };

    // Deactivate
    const deactivated = await changeUserActiveStatusService(req);
    assert.equal(deactivated.active, false);

    // Reactivate
    const reactivated = await changeUserActiveStatusService(req);
    assert.equal(reactivated.active, true);
  });

  it("5. Get Users List - Pagination and search filtering", async () => {
    const req = {
      query: {
        page: 1,
        limit: 10,
        search: "User Management Test",
      },
    };

    const result = await usersService(req);
    assert.ok(result.data.length >= 1);
    assert.equal(result.data[0].email, targetUser.email);
  });
});
