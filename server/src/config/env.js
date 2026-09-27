import dotenv from "dotenv";
dotenv.config();

const requiredEnvFields = [
  "PORT",
  "MONGODB_URI",
  "ACCESS_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRY",
  "REFRESH_TOKEN_SECRET",
  "REFRESH_TOKEN_EXPIRY",
  "IMAGEKIT_PRIVATE_KEY",
];

const missingFields = requiredEnvFields.filter((field) => !process.env[field]);

if (missingFields.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missingFields.join(", ")}`,
  );

  process.exit(1);
}

const port = Number(process.env.PORT);

if (Number.isNaN(port) || port <= 0) {
  console.error("❌ PORT must be a valid positive number.");
  process.exit(1);
}

const env = {
  PORT: port,

  MONGODB_URI: process.env.MONGODB_URI,

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,

  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,

  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
};

export default env;
