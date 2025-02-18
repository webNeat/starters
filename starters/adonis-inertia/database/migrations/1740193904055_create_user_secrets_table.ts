import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_secrets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments()
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('value').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
      table.timestamp('used_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
