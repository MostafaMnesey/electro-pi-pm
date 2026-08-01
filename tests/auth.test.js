import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import dotenv from "dotenv";
dotenv.config();

import * as db from "../src/database/dbService.js";
import {
  signupService,
  signinService,
} from "../src/modules/authentication/authenticaion.service.js";
import { MESSAGES } from "../src/Constants/messages.constants.js";

describe("Authentication Module Automated Tests", () => {
  let createdUserEmail;
  let createdUserPassword = "Password123!";
  let unapprovedEmail;
  let testMemberRole;

  before(async () => {
    testMemberRole = await db.findOne({
      model: "role",
      where: { name: "member" },
    });
  });

  after(async () => {
    if (createdUserEmail) {
      await db.deleteOne({ model: "user", where: { email: createdUserEmail } }).catch(() => {});
    }
    if (unapprovedEmail) {
      await db.deleteOne({ model: "user", where: { email: unapprovedEmail } }).catch(() => {});
    }
  });

  it("1. User Signup - Success", async () => {
    const timestamp = Date.now();
    createdUserEmail = `authtest_${timestamp}@test.com`;

    const req = {
      body: {
        name: "Auth Test User",
        email: createdUserEmail,
        password: createdUserPassword,
        phone: "+201099991111",
      },
    };

    const user = await signupService(req);
    assert.ok(user.id);
    assert.equal(user.email, createdUserEmail);

    // Approve user for subsequent signin test
    await db.updateOne({
      model: "user",
      where: { id: user.id },
      data: { approved: true, active: true },
    });
  });

  it("2. User Signup - Fail on Duplicate Email (expects 400)", async () => {
    const req = {
      body: {
        name: "Duplicate User",
        email: createdUserEmail,
        password: "Password123!",
        phone: "+201099992222",
      },
    };

    try {
      await signupService(req);
      assert.fail("Expected 400 error but signup succeeded");
    } catch (err) {
      assert.equal(err.cause, 400);
      assert.equal(err.message, "Email already exists");
    }
  });

  it("3. User Signin - Success with valid credentials", async () => {
    const req = {
      body: {
        email: createdUserEmail,
        password: createdUserPassword,
      },
    };

    const result = await signinService(req);
    assert.ok(result.accessToken);
    assert.ok(result.refreshToken);
    assert.equal(result.role, "member");
  });

  it("4. User Signin - Fail on Incorrect Password (expects 401)", async () => {
    const req = {
      body: {
        email: createdUserEmail,
        password: "WrongPassword999!",
      },
    };

    try {
      await signinService(req);
      assert.fail("Expected 401 error but signin succeeded");
    } catch (err) {
      assert.equal(err.cause, 401);
      assert.equal(err.message, MESSAGES.INVALID_CREDENTIALS);
    }
  });

  it("5. User Signin - Fail on Unapproved User (expects 400)", async () => {
    const timestamp = Date.now();
    unapprovedEmail = `unapproved_${timestamp}@test.com`;

    // Create unapproved user
    await signupService({
      body: {
        name: "Unapproved User",
        email: unapprovedEmail,
        password: "Password123!",
        phone: "+201099993333",
      },
    });

    const req = {
      body: {
        email: unapprovedEmail,
        password: "Password123!",
      },
    };

    try {
      await signinService(req);
      assert.fail("Expected 400 error for unapproved user but signin succeeded");
    } catch (err) {
      assert.equal(err.cause, 400);
      assert.equal(err.message, MESSAGES.USER_NOT_APPROVED);
    }
  });
});
