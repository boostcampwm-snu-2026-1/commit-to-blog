import { config } from "dotenv";

config({ quiet: true });

function readRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  clientOrigin: readRequiredEnv("CLIENT_ORIGIN"),
};
