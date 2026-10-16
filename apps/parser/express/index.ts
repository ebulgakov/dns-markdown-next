import server from "./server.ts";

import { env } from "#env.ts";

// Start the server
const port = env.PORT;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
