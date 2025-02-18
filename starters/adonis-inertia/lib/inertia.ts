import { HttpContext } from '@adonisjs/core/http'
import { InertiaPage, InertiaProps } from './types.js'

export function inertia<Page extends InertiaPage>(page: Page, props: InertiaProps<Page>) {
  return HttpContext.getOrFail().inertia.render(page, props)
}
