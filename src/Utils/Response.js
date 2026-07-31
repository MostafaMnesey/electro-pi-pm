import pkg from "@prisma/client";
const { Prisma } = pkg;

// =========================
// 🔹 Async Wrapper
// =========================
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// =========================
// 🔹 Global Error Handler
// =========================
export const globalErrorHandling = (err, req, res, next) => {
  // =========================
  // 🟡 Multer Errors
  // =========================
  if (err && err.name === "MulterError") {
    return res.status(400).json({
      message: "File upload error",
      status: 400,
      error: err.message || "File upload failed",
    });
  }

  // =========================
  // 🔴 Prisma Known Errors
  // =========================
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    let errorText = "Database error occurred";
    let status = 400;

    switch (err.code) {
      case "P2002":
        errorText = `Duplicate value for field: ${err.meta?.target || "unique constraint"}`;
        status = 409;
        break;

      case "P2003":
        errorText = `Invalid relation or foreign key constraint failed on field: ${err.meta?.field_name || "unknown"}`;
        status = 400;
        break;

      case "P2025":
        errorText = "Requested record not found";
        status = 404;
        break;

      default:
        errorText = err.message;
    }

    return res.status(status).json({
      message: "Database error",
      status,
      error: errorText,
      ...(process.env.NODE_ENV !== "production" && {
        meta: err.meta,
      }),
    });
  }

  // =========================
  // 🟠 Prisma Validation Error
  // =========================
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: "Database validation error",
      status: 400,
      error: err.message,
    });
  }

  // =========================
  // 🔵 Custom / Unknown Errors
  // =========================
  let status = err.cause;

  if (!status || typeof status !== "number") {
    status = err.status || err.statusCode || 500;
  }

  const errorText = err.message || "Internal server error";

  return res.status(status).json({
    message: "error",
    status,
    error: errorText,
    ...(err.details && { details: err.details }),
    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
    }),
  });
};

// =========================
// 🔹 Helpers
// =========================
export const errorResponse = ({
  message = "An error occurred",
  status = 400,
  details = null,
  cause,
  req,
  next,
} = {}) => {
  const error = new Error(message);
  error.cause = cause || status;
  if (details) error.details = details;
  throw error;
};

export const successResponse = ({
  res,
  req,
  status = 200,
  data = [],
  message = "Operation successful",
}) => {
  return res.status(status).json({
    message,
    status,
    data,
  });
};
