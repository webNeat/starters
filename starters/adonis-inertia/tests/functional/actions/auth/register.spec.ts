import { test } from '@japa/runner'
import { pick } from '#lib/helpers.js'
import { urls } from '#inertia/urls.js'
import { User } from '#app/models/index.js'
import { UserFactory } from '#database/factories/index.js'
import { expect_event, inertia_errors_checker } from '#lib/tests.js'
import emitter from '@adonisjs/core/services/emitter'

test.group(`GET ${urls.register.path}`, () => {
  test('renders the registration form', async ({ client, expect }) => {
    const res = await client.get(urls.register.uri()).withInertia()
    expect(res.status()).toBe(200)
    res.assertInertiaPage('register', {})
  })

  test('redirects to account page if already logged in', async ({ client }) => {
    const user = await UserFactory.create()
    const res = await client.get(urls.register.uri()).withInertia().loginAs(user)
    res.assertRedirectsTo(urls.account.uri())
  })
})

test.group(`POST ${urls.register.path}`, () => {
  test('creates a new user and logs them in', async ({ client, expect, events }) => {
    const { email, password } = await UserFactory.make()
    const res = await client
      .post(urls.register.uri())
      .redirects(0)
      .withInertia()
      .withCsrfToken()
      .form({ email, password, password_confirmation: password })

    // creates the user
    const user = await User.findByOrFail('email', email)

    // logs the user in
    res.assertRememberMeCookie(true)

    // redirects to account page
    res.assertStatus(302)
    res.assertHeader('location', urls.account.uri())

    // emits the `user:created` event
    expect_event('user:created', (data) => {
      expect(data.user.id).toEqual(user.id)
      expect(data.user.email).toEqual(user.email)
      expect(data.user.isEmailConfirmed).toEqual(false)
    })
  })

  test('handles validation errors', async ({ client, expect }) => {
    const existing_user = await UserFactory.create()
    const expect_errors = inertia_errors_checker('register', urls.register.uri())
    const { email, password } = await UserFactory.make()
    const data = { email, password, password_confirmation: password }

    await expect_errors({ ...data, email: 'invalid-email' }, { email: 'The email field must be a valid email address' })
    await expect_errors(
      { ...data, password: 'short', password_confirmation: 'short' },
      { password: 'The password field must have at least 8 characters' },
    )
    await expect_errors(
      { ...data, password_confirmation: password + 'different' },
      { password_confirmation: 'The password_confirmation field and password field must be the same' },
    )
    await expect_errors({ ...data, email: existing_user.email }, { email: 'The email has already been taken' })
  })
})
