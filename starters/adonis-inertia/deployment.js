import yaml from 'yaml'
import { ci, deploy, db, app, destroy, command } from 'hosty'

const repo = ci.repo()
const branch = ci.branch()
const is_prod = branch === 'main'
const domain = (is_prod ? '' : branch + '.') + '{{domain}}'
const vars = ci.vars()

const env = yaml.parse(is_prod ? vars.prod_env : vars.dev_env)
env.NODE_ENV = 'production'
env.PORT = '80'
env.HOST = '0.0.0.0'
env.CLIENT_URL = `https://${domain}`

const database = db.postgres({
  name: `${domain}_db`,
  user: env.DB_USER,
  pass: env.DB_PASSWORD,
})

env.DB_HOST = database.host
env.DB_PORT = database.port
env.DB_DATABASE = database.name

const application = app.git({
  name: domain,
  domain,
  repo,
  branch,
  env,
  compose: {
    volumes: ['./storage:/app/storage'],
  },
})

const db_migration = command({
  name: `${domain}_db_migration`,
  cmd: 'node ace migration:run --force',
  service: application,
})

const services = [database, application, db_migration]

if (ci.event() === 'delete') destroy(ci.server(), ...services)
else deploy(ci.server(), ...services)

ci.run()
