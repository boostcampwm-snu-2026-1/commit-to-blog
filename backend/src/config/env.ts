import { config } from "dotenv";

config({ quiet: true });

function readRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readOptionalPort(name: string, fallback: number) {
  const value = process.env[name];

  if (value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid port value for environment variable: ${name}`);
  }

  return parsed;
}

export const env = {
  port: readOptionalPort("PORT", 3000),
  clientOrigin: readRequiredEnv("CLIENT_ORIGIN"),
  mongodbUri: readRequiredEnv("MONGODB_URI"),
  githubToken: readRequiredEnv("GITHUB_TOKEN"),
  geminiApiKey: readRequiredEnv("GEMINI_API_KEY"),
};
