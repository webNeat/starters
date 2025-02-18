import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  CLIENT_URL: Env.schema.string(),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as const),

  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),

  DB_HOST: Env.schema.string(),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  MAIL_TRANSPORT: Env.schema.enum(['smtp', 'resend'] as const),
  SMTP_HOST: Env.schema.string(),
  SMTP_PORT: Env.schema.string(),
  FROM_EMAIL: Env.schema.string(),
  FROM_NAME: Env.schema.string(),
  RESEND_API_KEY: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring ally package
  |----------------------------------------------------------
  */
  DISCORD_CLIENT_ID: Env.schema.string(),
  DISCORD_CLIENT_SECRET: Env.schema.string(),
  GITHUB_CLIENT_ID: Env.schema.string(),
  GITHUB_CLIENT_SECRET: Env.schema.string(),
  GOOGLE_CLIENT_ID: Env.schema.string(),
  GOOGLE_CLIENT_SECRET: Env.schema.string()
})
