import { env } from "./config/env.js";
import { app } from "./app.js";

app.listen(env.port, () => {
  console.log(`Backend server listening on port ${env.port}`);
});
