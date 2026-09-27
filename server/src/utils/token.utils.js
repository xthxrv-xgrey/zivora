import { createHash } from "node:crypto";
import jwt from "jsonwebtoken";

import env from "../config/env.js";

// ============================================================================
// Access Token
// ============================================================================

/**
 * Generates an access token.
 */
export const generateAccessToken = (userId) => {
  const payload = {
    userId,
  };

  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRY,
  });
};

/**
 * Verifies and decodes an access token.
 */
export const verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.userId !== "string"
  ) {
    throw new Error("Invalid access token payload");
  }

  return decoded;
};

// ============================================================================
// Refresh Token
// ============================================================================

/**
 * Generates a refresh token.
 */
export const generateRefreshToken = (userId) => {
  const payload = {
    userId,
  };

  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY,
  });
};

/**
 * Verifies and decodes a refresh token.
 */
export const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.userId !== "string"
  ) {
    throw new Error("Invalid refresh token payload");
  }

  return decoded;
};

// ============================================================================
// Token Utilities
// ============================================================================

/**
 * Hashes a refresh token using SHA-256.
 */
export const hashRefreshToken = (refreshToken) =>
  createHash("sha256").update(refreshToken).digest("hex");
