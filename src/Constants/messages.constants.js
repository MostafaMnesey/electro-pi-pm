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
  USER_NOT_ACTIVE: "User account is deactivated",
  USER_STATUS_UPDATED: "User status updated successfully",
  INVALID_CREDENTIALS: "Invalid email or password",
  SIGNUP_SUCCESS: "Account registered successfully, wait for admin approval",
  LOGIN_SUCCESS: "Login successful",
  TOKEN_VERIFIED: "Token verified successfully",
  TOKEN_REFRESHED: "Token refreshed successfully",
  REFRESH_TOKEN_REQUIRED: "Refresh token is required",
  INVALID_REFRESH_TOKEN: "Invalid or expired refresh token",
  ROLE_NOT_FOUND: "Role not found",
  PROFILE_FETCHED: "Profile fetched successfully",

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

  // Errors & Rate Limiting
  VALIDATION_ERROR: "Validation failed for the request payload",
  INTERNAL_SERVER_ERROR: "An internal server error occurred",
  TOO_MANY_REQUESTS: "Too many requests, please try again later",
  INVALID_FILE_FORMAT: "Invalid file format or file type not supported",
  FILE_UPLOAD_ERROR: "An error occurred during file upload",


  //project
  PROJECT_CREATED: "Project created successfully",
  PROJECT_UPDATED: "Project updated successfully",
  PROJECT_DELETED: "Project deleted successfully",
  PROJECT_FETCHED: "Project fetched successfully",
  PROJECT_ALREADY_EXISTS: "Project already exists",
  MEMBER_ADDED: "Member added successfully",
  MEMBER_REMOVED: "Member removed successfully",
  MEMBER_NOT_FOUND: "Member not found",
  MEMBERS_NOT_FOUND: "Some members not found",

  USER_ALREADY_APPROVED: "User is already approved",

  // task
  TASK_CREATED: "Task created successfully",
  TASK_UPDATED: "Task updated successfully",
  TASK_DELETED: "Task deleted successfully",
  TASK_FETCHED: "Task fetched successfully",
  TASK_NOT_FOUND: "Task not found",
  NOT_PROJECT_MEMBER: "Assignee is not a member of this project",
  NOT_TASK_ASSIGNEE: "Only the assigned member can update task status",
};
