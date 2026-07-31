import { verifyToken } from "../Utils/Token/token.js";
import * as db from "../database/dbService.js";
import { MESSAGES } from "../Constants/messages.constants.js";

export const socketAuthentication = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token || typeof token !== "string") {
      return next(new Error(MESSAGES.TOKEN_REQUIRED, { cause: 401 }));
    }

    const decoded = verifyToken({ token });
    if (!decoded || !decoded.id) {
      return next(new Error(MESSAGES.INVALID_TOKEN, { cause: 401 }));
    }

    const user = await db.findFirst({
      model: "user",
      where: {
        id: decoded.id,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      return next(new Error(MESSAGES.USER_NOT_FOUND, { cause: 401 }));
    }

    socket.user = user;
    socket.decoded = decoded;

    next();
  } catch (error) {
    next(error);
  }
};
