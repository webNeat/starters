import { DateTime } from 'luxon'
import { test } from '@japa/runner'
import { urls } from '#inertia/urls.js'
import { expect_date_close_to, expect_event } from '#lib/tests.js'
import { UserFactory, UserSecretFactory } from '#database/factories/index.js'

test.group(`GET ${urls.confirm_email.path}`, () => {
  test('renders the confirmation page with success status', async ({ client, expect }) => {
    const user = await UserFactory.merge({ isEmailConfirmed: false }).create()
    const secret = await UserSecretFactory.merge({ userId: user.id, value: 'confirmation-key', usedAt: null }).create()

    const res = await client.get(urls.confirm_email.uri({ key: secret.value })).withInertia()

    expect(res.status()).toBe(200)
    res.assertInertiaPage('confirm-email', {})

    await user.refresh()
    expect(user.isEmailConfirmed).toBe(true)

    await secret.refresh()
    expect(secret.usedAt).not.toBeNull()
    expect_date_close_to(secret.usedAt!, DateTime.now(), 1000)

    expect_event('user:confirmed_email', (data) => {
      expect(data.user.id).toEqual(user.id)
    })
  })

  test('handles invalid token', async ({ client, expect }) => {
    const res = await client.get(urls.confirm_email.uri({ key: 'invalid-token' })).withInertia()

    expect(res.status()).toBe(404)
  })

  test('handles expired token', async ({ client, expect }) => {
    const user = await UserFactory.merge({ isEmailConfirmed: false }).create()
    const secret = await UserSecretFactory.merge({
      userId: user.id,
      value: 'expired-token',
      usedAt: DateTime.now().minus({ hours: 73 }),
    }).create()

    const res = await client.get(urls.confirm_email.uri({ key: secret.value })).withInertia()

    expect(res.status()).toBe(404)

    await user.refresh()
    expect(user.isEmailConfirmed).toBe(false)
  })
})
