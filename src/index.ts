import { config } from "dotenv";
import { mongoConnect } from "./helpers/mongodb-connect.helper";
import { initExpress } from "./helpers/express-init.helper";

config();

async function main() {
  await mongoConnect();
  initExpress();
}

main();
