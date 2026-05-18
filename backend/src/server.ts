import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { app } from "./app.js";

async function main() {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`Backend server listening on port ${env.port}`);
  });
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Backend startup failed: ${message}`);
  process.exit(1);
});
