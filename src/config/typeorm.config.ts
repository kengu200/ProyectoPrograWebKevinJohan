import { createConnection } from "typeorm";
import path = require("path")
import  enviroment   from "./enviroments.config";

export async function connect() { 

    await createConnection({
        type: 'mysql',
        host: enviroment.databaseHost,
        port: enviroment.databasePort,
        username: enviroment.databaseUserName,
        password: enviroment.databasePassword,
        database: enviroment.databaseName,
        entities: [
            path.join(__dirname, '../entities/**/**.ts')
        ],
        migrations: [
            path.join(__dirname, '../migrations/**/**.ts')
        ],
        subscribers: [
            path.join(__dirname, '../migrations/**/**.ts')
        ],
        cli: {
            entitiesDir: "src/entities",
            migrationsDir: "src/migrations",
            subscribersDir: "src/suscribers",
        },
        logging: false,
        synchronize: true
    });
    console.log("Database is connected");

}
