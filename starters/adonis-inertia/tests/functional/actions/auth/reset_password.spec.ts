import { DateTime } from 'luxon'
import { test } from '@japa/runner'
import { urls } from '#inertia/urls.js'
import { UserFactory, UserSecretFactory } from '#database/factories/index.js'
import { expect_date_close_to, expect_event, inertia_errors_checker } from '#lib/tests.js'

test.group(`GET ${urls.reset_password.path}`, () => {
  test('renders the reset password form', async ({ client, expect }) => {
    const user = await UserFactory.create()
    const secret = await UserSecretFactory.merge({ userId: user.id, usedAt: null }).create()
    const res = await client.get(urls.reset_password.uri({ key: secret.value })).withInertia()
    expect(res.status()).toBe(200)
    res.assertInertiaPage('reset-password', { key: secret.value })
  })

  test('returns 404 if the token is invalid', async ({ client }) => {
    const res = await client.get(urls.reset_password.uri({ key: 'invalid-key' })).withInertia()
    res.assertStatus(404)
  })
})

test.group(`POST ${urls.reset_password.path}`, () => {
  test('resets user password and redirects to the login page', async ({ client, expect, events }) => {
    const user = await UserFactory.merge({ password: 'old-password' }).create()
    const secret = await UserSecretFactory.merge({ userId: user.id, usedAt: null }).create()
    const new_password = 'new-password'
    const res = await client
      .post(urls.reset_password.uri({ key: secret.value }))
      .redirects(0)
      .withInertia()
      .withCsrfToken()
      .form({ password: new_password, password_confirmation: new_password })

    // updates the user password
    await user.refresh()
    expect(user.password).toEqual(new_password) // password hashing is disabled during tests!

    // marks the secret as used
    await secret.refresh()
    expect(secret.usedAt).not.toBeNull()
    expect_date_close_to(secret.usedAt!, DateTime.now())

    // redirects to login page
    res.assertStatus(302)
    res.assertHeader('location', urls.login.uri())

    // emits the `user:password_changed` event
    // expect_event('user:password_changed', (data) => {
    //   expect(data.user.id).toEqual(user.id)
    //   expect(data.user.email).toEqual(user.email)
    //   expect(data.user.isEmailConfirmed).toEqual(false)
    // })
  })

  test('handles validation errors', async ({ client, expect }) => {
    const user = await UserFactory.merge({ password: 'old-password' }).create()
    const secret = await UserSecretFactory.merge({ userId: user.id, usedAt: null }).create()
    const expect_errors = inertia_errors_checker('reset-password', urls.reset_password.uri({ key: secret.value }))

    await expect_errors(
      { password: 'short', password_confirmation: 'short' },
      { password: 'The password field must have at least 8 characters' },
    )
    await expect_errors(
      { password: 'new-password', password_confirmation: 'other-new-password' },
      { password_confirmation: 'The password_confirmation field and password field must be the same' },
    )
  })
})
