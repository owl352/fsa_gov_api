import { config } from "dotenv";
import { mongoConnect } from "./helpers/mongodb-connect.helper";
import { initExpress } from "./helpers/express-init.helper";

config();

async function main() {
  const mongo = await mongoConnect();
  initExpress(mongo);
}
main();
