import { test } from '@japa/runner'
import { urls } from '#inertia/urls.js'
import { UserFactory } from '#database/factories/index.js'

test.group(`POST ${urls.logout.path}`, () => {
  test('logs out the current user', async ({ client, expect }) => {
    const user = await UserFactory.create()
    const res = await client.post(urls.logout.uri()).redirects(0).withCsrfToken().withInertia().loginAs(user)
    res.assertStatus(302)
    res.assertHeader('location', urls.login.uri())
    res.assertRememberMeCookie(false)
  })
})
