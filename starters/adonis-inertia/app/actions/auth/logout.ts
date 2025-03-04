import { action } from '#lib/index.js'
import { urls } from '#inertia/urls.js'

export const submit = action({
  async handle({ ctx }) {
    await ctx.auth.use('web').logout()
    return ctx.response.redirect(urls.login.uri())
  },
})
