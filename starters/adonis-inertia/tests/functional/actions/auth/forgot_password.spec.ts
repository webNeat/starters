import { test } from '@japa/runner'
import env from '#start/env.js'
import emails from '#emails/index.js'
import { urls } from '#inertia/urls.js'
import { UserFactory } from '#database/factories/index.js'
import { expect_email_sent, inertia_errors_checker } from '#lib/tests.js'

test.group(`GET ${urls.forgot_password.path}`, () => {
  test('renders the forgot password form', async ({ client, expect }) => {
    const res = await client.get(urls.forgot_password.uri()).withInertia()
    res.assertStatus(200)
    res.assertInertiaPage('forgot-password', { state: 'form' })
  })

  test('redirects to account page if already logged in', async ({ client }) => {
    const user = await UserFactory.create()
    const res = await client.get(urls.forgot_password.uri()).withInertia().loginAs(user)
    res.assertRedirectsTo(urls.account.uri())
  })
})

test.group(`POST ${urls.forgot_password.path}`, () => {
  test('sends a password reset email', async ({ client, expect }) => {
    const user = await UserFactory.create()
    const res = await client.post(urls.forgot_password.uri()).withInertia().withCsrfToken().form({ email: user.email })

    res.assertStatus(200)
    res.assertInertiaPage('forgot-password', { state: 'sent' })

    const secret = await user.related('secrets').query().firstOrFail()
    const reset_password_url = env.get('CLIENT_URL') + urls.reset_password.uri({ key: secret.value })
    expect_email_sent(user.email, await emails.reset_password({ reset_password_url }))
  })

  test('handles validation errors', async ({ client, expect }) => {
    const expect_errors = inertia_errors_checker('forgot-password', urls.forgot_password.uri())
    await expect_errors({ email: 'invalid-email' }, { email: 'The email field must be a valid email address' })
  })
})
