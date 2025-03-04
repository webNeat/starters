import vine from '@vinejs/vine'
import { HttpContext } from '@adonisjs/core/http'
import { ActionConfig } from './types.js'

export function action<R, Query = never, Body = never>(config: ActionConfig<{ query: Query; body: Body; res: R }>) {
  const query = config.query ? vine.compile(config.query) : undefined
  const body = config.body ? vine.compile(config.body) : undefined
  return async (ctx: HttpContext) => {
    return config.handle({
      ctx,
      query: (await query?.validate(ctx.request.qs())) as Query,
      body: (await body?.validate(ctx.request.body())) as Body,
    })
  }
}
