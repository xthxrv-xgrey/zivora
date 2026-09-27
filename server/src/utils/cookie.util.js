import env from "../config/env.js";

function parseDurationToMs(duration) {
  const match = /^(\d+)\s*(d|h|m|s)?$/.exec(String(duration).trim());

  if (!match) return 7 * 24 * 60 * 60 * 1000; // sane fallback: 7 days

  const value = Number(match[1]);
  const unitMs = { d: 86400000, h: 3600000, m: 60000, s: 1000 }[
    match[2] ?? "s"
  ];

  return value * unitMs;
}

const isProduction = process.env.NODE_ENV === "production";

export const cookieConfig = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: parseDurationToMs(env.REFRESH_TOKEN_EXPIRY),
};
