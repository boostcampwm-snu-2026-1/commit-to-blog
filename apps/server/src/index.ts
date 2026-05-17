import { env, integrationMode } from "./config/env.js";
import { app } from "./app.js";

app.listen(env.PORT, () => {
  console.log(
    `Commit to Blog server listening on http://localhost:${env.PORT} (github: ${integrationMode.github}, openai: ${integrationMode.openAI})`
  );
});
