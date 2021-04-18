export default {
    databaseUserName: process.env.DATABASE_USERNAME ?? '',
    databasePassword: process.env.DATABASE_PASSWORD ?? '',
    databaseName: process.env.DATABASE_NAME ?? '',
    databaseHost: process.env.DATABASE_HOST ?? '',
    databasePort: Number(process.env.DATABASE_PORT) ?? 0,
    jwtSecretKey: process.env.JWT_SECRET_KEY ?? '' 
 }