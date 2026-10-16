import getPerformance from "@src/helpers/get-performance";

import { addVectorDb } from "./add-vector-db";

getPerformance(addVectorDb)
  .then(() => {
    console.log("/************** VECTOR DB ADDED ****************/");
  })
  .catch(err => {
    console.error("Error adding vector DB:", err);
  });
