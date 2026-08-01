import { mainRoles } from "../../Utils/Enums/roles.js";
import { errorResponse } from "../../Utils/Response.js";
import { compareText, hashText } from "../../Utils/Security/index.js";
import { generateTokensForUser, verifyToken, tokenTypeEnum } from "../../Utils/Token/token.js";
import { MESSAGES } from "../../Constants/messages.constants.js";
import * as db from "../../database/dbService.js";

export const signupService = async (req) => {
  const { email, password, phone, name } = req.body;

  const emailExists = await db.findOne({
    model: "user",
    where: {
      email,
    },
  });
  if (emailExists) {
    errorResponse({
      message: "Email already exists",
      status: 400,
    });
  }

  const hashPassword = await hashText({
    text: password,
  });
  const role = await db.findOne({
    model: "role",
    where: {
      name: mainRoles.MEMBER,
    },
  });

  const user = await db.create({
    model: "user",
    data: {
      email,
      password: hashPassword,
      phone,
      name,
      roleId: role?.id ? role.id : null,
    },
  });

  return user;
};

export const signinService = async (req) => {
  const { email, password } = req.body;

  const user = await db.findOne({
    model: "user",
    where: {
      email,
    },
    include:{
      role:{
        include:{
          rolePermissions:{
            include:{
              permission:true,
            }
          }
        }
      }
    }
  });

  if (!user) {
    errorResponse({
      message: MESSAGES.INVALID_CREDENTIALS,
      status: 401,
    });
  }

  if (!user.approved) {
    errorResponse({
      message: MESSAGES.USER_NOT_APPROVED,
      status: 400,
    });
  }

  if (!user.active) {
    errorResponse({
      message: MESSAGES.USER_NOT_ACTIVE,
      status: 403,
    });
  }

  const validPassword = await compareText({
    text: password,
    hash: user.password,
  });

  if (!validPassword) {
    errorResponse({
      message: MESSAGES.INVALID_CREDENTIALS,
      status: 401,
    });
  }

  const tokens = generateTokensForUser({ user });
  return {
    ...tokens,
    role: user.role.name,
    permissions: user.role.rolePermissions.map((rp) => {
      return{
        action:rp.permission.name,
        code:rp.permission.code,
        resource:rp.permission.resource,
        
      }
      
    }),
    
  };
};

export const refreshTokenService = async (req) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    errorResponse({
      message: MESSAGES.REFRESH_TOKEN_REQUIRED,
      status: 400,
    });
  }

  let decoded;
  try {
    decoded = verifyToken({ token: refreshToken, tokenType: tokenTypeEnum.refresh });
  } catch (err) {
    errorResponse({
      message: MESSAGES.INVALID_REFRESH_TOKEN,
      status: 401,
    });
  }

  if (!decoded || !decoded.id) {
    errorResponse({
      message: MESSAGES.INVALID_REFRESH_TOKEN,
      status: 401,
    });
  }

  const user = await db.findOne({
    model: "user",
    where: {
      id: decoded.id,
      approved: true,
      active: true,
    },
  });

  if (!user) {
    errorResponse({
      message: MESSAGES.USER_NOT_FOUND,
      status: 401,
    });
  }

  const tokens = generateTokensForUser({ user });
  return tokens;
};
