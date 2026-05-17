import { app } from "./app.js";

const DEFAULT_PORT = 3000;
const port = Number(process.env.PORT ?? DEFAULT_PORT);

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
