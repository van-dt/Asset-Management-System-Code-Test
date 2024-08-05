export const configuration = () => ({
  environment: process.env.NODE_ENV,
  appName: process.env.APP_NAME,
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  databasePostgres: {
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT
      ? parseInt(process.env.DB_POSTGRES_PORT, 10)
      : 5432,
    user: process.env.DB_POSTGRES_USER,
    password: process.env.DB_POSTGRES_PASSWORD,
    name: process.env.DB_POSTGRES_NAME,
    trigger: process.env.DB_POSTGRES_TRIGGER
      ? JSON.parse(process.env.DB_POSTGRES_TRIGGER)
      : false,
  },
  winston: {
    path: process.env.WINSTON_LOG_PATH,
  },
  assetsApiUrl: process.env.ASSETS_API_URL,
});

export enum EConfiguration {
  ENVIRONMENT = 'environment',
  APP_NAME = 'appName',
  PORT = 'port',

  DB_POSTGRES_HOST = 'databasePostgres.host',
  DB_POSTGRES_PORT = 'databasePostgres.port',
  DB_POSTGRES_USER = 'databasePostgres.user',
  DB_POSTGRES_PASSWORD = 'databasePostgres.password',
  DB_POSTGRES_NAME = 'databasePostgres.name',
  DB_POSTGRES_TRIGGER = 'databasePostgres.trigger',

  WINSTON_LOG_PATH = 'winston.path',

  ASSETS_API_URL = 'assetsApi.url',
}
