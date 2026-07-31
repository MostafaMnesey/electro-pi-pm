import { mainRoles } from "../../Utils/Enums/roles.js";
import { errorResponse } from "../../Utils/Response.js";
import { MESSAGES } from "../../Constants/messages.constants.js";
import { redis } from "../../Utils/Radis/Connection.js";
import * as db from "../../database/dbService.js";

export const getProfileService = async (req) => {
  const { user } = req;
  return user;
};

export const usersService = async (req) => {
  const { page = 1, limit = 10, search, role, approved, active } = req.query;
  const where = { approved: true, active: true };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  if (role) {
    const userRole = await db.findOne({
      model: "role",
      where: {
        name: role,
      },
      select: {
        id: true,
      },
    });

    if (!userRole) {
      errorResponse({
        message: MESSAGES.ROLE_NOT_FOUND,
        status: 404,
      });
    }

    where.roleId = userRole.id;
  }

  if (approved !== undefined && approved !== "") {
    if (typeof approved === "boolean") {
      where.approved = approved;
    } else {
      const lower = String(approved).toLowerCase();
      where.approved = lower === "true" || lower === "1";
    }
  }

  if (active !== undefined && active !== "") {
    if (typeof active === "boolean") {
      where.active = active;
    } else {
      const lower = String(active).toLowerCase();
      where.active = lower === "true" || lower === "1" || lower === "active";
    }
  }

  const users = await db.findManyWithPaginationAndCount({
    model: "user",
    page,
    limit,
    where,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      approved: true,
      active: true,
      createdAt: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return users;
};

export const changeUserActiveStatusService = async (req) => {
  const userId = req.params.id || req.params.userId;

  const targetUser = await db.findOne({
    model: "user",
    where: { id: userId },
  });

  if (!targetUser) {
    errorResponse({
      message: MESSAGES.USER_NOT_FOUND,
      status: 404,
    });
  }

  const newActiveStatus = !targetUser.active;

  const updatedUser = await db.updateOne({
    model: "user",
    where: { id: targetUser.id },
    data: { active: newActiveStatus },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      approved: true,
      active: true,
      updatedAt: true,
    },
  });

  // Clear Redis user cache so status change takes immediate effect
  try {
    await redis.del(`user:${targetUser.id}`);
  } catch (err) {
    console.error("Redis Cache Clear Error:", err.message);
  }

  return updatedUser;
};
