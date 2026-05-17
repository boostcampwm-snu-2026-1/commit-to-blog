import dotenv from "dotenv";

dotenv.config();

const parsePort = (value: string | undefined) => {
  const port = Number(value ?? "3001");
  return Number.isFinite(port) ? port : 3001;
};

export const env = {
  port: parsePort(process.env.PORT),
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  githubToken: process.env.GITHUB_TOKEN ?? "",
};
