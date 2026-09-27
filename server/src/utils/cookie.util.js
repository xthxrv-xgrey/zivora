import env from "../config/env.js";

export const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: isProduction ? "none" : "lax",
  maxAge: parseDurationToMs(env.REFRESH_TOKEN_EXPIRY),
};
