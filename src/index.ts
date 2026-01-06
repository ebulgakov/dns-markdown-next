import server from "./server.js";

// Start the server
const port = process.env.PORT ?? "9001";
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
