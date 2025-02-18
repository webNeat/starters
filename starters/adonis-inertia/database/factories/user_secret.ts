import Factory from '@adonisjs/lucid/factories'
import { UserSecret } from '#app/models/index.js'

export const UserSecretFactory = Factory.define(UserSecret, ({ faker }) => {
  return {
    userId: faker.number.int({ min: 1, max: 10 }),
    value: faker.internet.password({ length: 10 }),
    usedAt: null,
  }
}).build()
