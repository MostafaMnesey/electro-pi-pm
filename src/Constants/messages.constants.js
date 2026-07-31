/**
 * Centralized Application Response Messages
 */

export const MESSAGES = {
  // Authentication & Access
  UNAUTHORIZED: "Authentication is required to access this resource",
  TOKEN_REQUIRED: "Authorization header with Bearer token is required",
  INVALID_TOKEN: "Invalid or expired authentication token",
  FORBIDDEN: "You do not have permission to access this resource",
  USER_NOT_FOUND: "User account was not found",
  USER_NOT_APPROVED: "User account is not approved yet",
  INVALID_CREDENTIALS: "Invalid email or password",
  SIGNUP_SUCCESS: "Account registered successfully, wait for admin approval",
  LOGIN_SUCCESS: "Login successful",
  TOKEN_VERIFIED: "Token verified successfully",
  TOKEN_REFRESHED: "Token refreshed successfully",
  REFRESH_TOKEN_REQUIRED: "Refresh token is required",
  INVALID_REFRESH_TOKEN: "Invalid or expired refresh token",

  // Generic Resource Actions
  SUCCESS: "Operation completed successfully",
  CREATED: "Resource created successfully",
  UPDATED: "Resource updated successfully",
  DELETED: "Resource deleted successfully",
  FETCHED: "Data retrieved successfully",
  NOT_FOUND: "Requested resource not found",

  EMAIL_INVALID: "Invalid email address",
  EMAIL_REQUIRED: "Email address is required",
  PASSWORD_INVALID: "Invalid password",
  PASSWORD_REQUIRED: "Password is required",
  PHONE_INVALID: "Invalid phone number",
  PHONE_REQUIRED: "Phone number is required",
  CONFIRM_PASSWORD_INVALID: "Passwords do not match",
  CONFIRM_PASSWORD_REQUIRED: "Confirm password is required",
  NAME_REQUIRED: "name is required",
  PROFILE_FETCHED: "profile fetched successfully",

  // Errors & Rate Limiting
  VALIDATION_ERROR: "Validation failed for the request payload",
  INTERNAL_SERVER_ERROR: "An internal server error occurred",
  TOO_MANY_REQUESTS: "Too many requests, please try again later",
  INVALID_FILE_FORMAT: "Invalid file format or file type not supported",
  FILE_UPLOAD_ERROR: "An error occurred during file upload",
};
