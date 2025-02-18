import { User } from '#app/models/index.js'
import Factory from '@adonisjs/lucid/factories'
import validator from 'validator'

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    email: validator.normalizeEmail(faker.internet.email()) || 'test@example.com',
    password: faker.internet.password({ length: 10 }),
    isEmailConfirmed: false,
  }
})
  .state('emailConfirmed', (user) => {
    user.isEmailConfirmed = true
  })
  .build()
