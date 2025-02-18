import type { PageProps } from '#inertia/types.js'

declare module '#lib/types.js' {
  interface InertiaPages extends PageProps {}
}
