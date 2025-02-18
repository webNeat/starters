import { test } from '@japa/runner'
import { urls } from '#inertia/urls.js'
import { UserFactory } from '#database/factories/index.js'
import { inertia_errors_checker } from '#lib/tests.js'

test.group(`GET ${urls.login.path}`, () => {
  test('renders the login form', async ({ client, expect }) => {
    const res = await client.get(urls.login.uri()).withInertia()
    expect(res.status()).toBe(200)
    res.assertInertiaPage('login', {})
  })

  test('redirects to account page if already logged in', async ({ client }) => {
    const user = await UserFactory.create()
    const res = await client.get(urls.login.uri()).withInertia().loginAs(user)
    res.assertRedirectsTo(urls.account.uri())
  })
})

test.group(`POST ${urls.login.path}`, () => {
  test('logs in a user with correct credentials', async ({ client, expect }) => {
    const password = 'correct-password'
    const user = await UserFactory.merge({ password }).create()
    const res = await client.post(urls.login.uri()).redirects(0).withInertia().withCsrfToken().form({ email: user.email, password })
    res.assertStatus(302)
    res.assertHeader('location', urls.account.uri())
    res.assertRememberMeCookie(true)
  })

  test('handles validation errors', async ({ client, expect }) => {
    const expect_errors = inertia_errors_checker('login', urls.login.uri())
    const password = 'correct-password'
    const user = await UserFactory.merge({ password }).create()
    const data = { email: user.email, password }

    await expect_errors({ ...data, email: 'invalid-email' }, { email: 'The email field must be a valid email address' })
    await expect_errors({ email: 'nonexistent@example.com', password }, { E_INVALID_CREDENTIALS: 'Invalid user credentials' })
    await expect_errors({ email: user.email, password: 'wrong-password' }, { E_INVALID_CREDENTIALS: 'Invalid user credentials' })
  })
})
