export default {
    databaseUserName: process.env.DATABASE_USERNAME ?? 'progra_user',
    databasePassword: process.env.DATABASE_PASSWORD ?? 'LwsGmDYC[Fkz0sbz',
    databaseName: process.env.DATABASE_NAME ?? 'progra_web',
    databaseHost: process.env.DATABASE_HOST ?? '127.0.0.1',
    databasePort: Number(process.env.DATABASE_PORT) ?? 3306,
    jwtSecretKey: process.env.JWT_SECRET_KEY ?? 'LwsGmDYC[Fkz0sbz' 
 }