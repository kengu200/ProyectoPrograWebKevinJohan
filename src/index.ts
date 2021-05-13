import "reflect-metadata";
import * as dotenv from 'dotenv';
import { startServer } from "./app";
import { connect } from "./config/typeorm.config";

async function main() {
    dotenv.config();
    connect();
    const app = await startServer();
    app.listen(3006);
    console.log("Server  Listening on http://localhost:"+ 3006);
    //Guti se la come
}
main();