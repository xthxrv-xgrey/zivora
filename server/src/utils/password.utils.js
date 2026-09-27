import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
};

export const verifPassword = async (password, passwordHash) => {
  const match = await bcrypt.compare(password, passwordHash);
  return match;
};
