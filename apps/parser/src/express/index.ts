import { env } from "@src/env";

import server from "./server";

// Start the server
const port = env.PORT;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
