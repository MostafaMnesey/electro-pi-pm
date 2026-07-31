import * as RedisUtils from "../Redis/index.js";
import * as db from "../../database/dbService.js";

/**
 * Socket.io Logic
 * Handles real-time communication events
 */

let ioInstance;

export const getIO = () => ioInstance;

export const init_io = (io) => {
  ioInstance = io;
  io.on("connection", async (socket) => {
    try {
      const user = socket.user;
      if (!user) return socket.disconnect();

      // Join user-specific room
      socket.join(`user_${user.id}`);

      // 1. Online status tracking
      const isFirstConnection = await RedisUtils.setUserOnline(user.id, socket.id);
      
      // Notify others only if this is the first connection
      if (isFirstConnection) {
        socket.broadcast.emit("user:status", { userId: user.id, status: "online" });
      }

      socket.on("disconnect", async () => {
        const isLastConnection = await RedisUtils.setUserOffline(user.id, socket.id);
        
        // Notify others only if this was the last connection
        if (isLastConnection) {
          socket.broadcast.emit("user:status", { userId: user.id, status: "offline" });
        }
      });

    } catch (error) {
      console.error("Socket connection error:", error);
      socket.disconnect();
    }
  });
};
