import type { HttpContext } from '@adonisjs/core/http'
import type { ConstructableSchema } from '@vinejs/vine/types'

export type ActionConfig<Context extends { query: any; body: any; res: any }> = {
  query?: ConstructableSchema<any, Context['query'], any>
  body?: ConstructableSchema<any, Context['body'], any>
  handle: (ctx: { ctx: HttpContext } & Omit<Context, 'res'>) => Promise<Context['res']>
}

export type ServiceClass<Config> = new (config: Config) => any
export type FakeClass = new () => any
export type ServiceOptions<Config, Class extends ServiceClass<Config>, Fake extends FakeClass> = {
  name: string
  class: Class
  fake: Fake
}
export type ServiceConfig<Options extends ServiceOptions<any, any, any>> = ConstructorParameters<Options['class']>[0]
export type Service<Class extends new (config: any) => any, Fake extends new () => any> = InstanceType<Class> & {
  fake: () => InstanceType<Fake>
  restore: () => void
}

export type TestPluginConfig = {
  services: Record<string, Service<any, any>>
}

export type LazyImport<T> = () => Promise<{ default: T }>
export type InferLazyImport<T extends LazyImport<any>> = Awaited<ReturnType<T>>['default']

export type InferEvents<T, F = Flatten<T, ':'>> = {
  [K in keyof F]: F[K] extends (x: any) => any ? Parameters<F[K]>[0] : never
}

export interface InertiaPages {}
export type InertiaPage = keyof InertiaPages
export type InertiaProps<T extends InertiaPage> = InertiaPages[T]

export type RouteParam<T extends string> = T extends `${infer Part}/${infer Rest}`
  ? (Part extends `:${infer Param}` ? Param : never) | RouteParam<Rest>
  : T extends `:${infer Param}`
    ? Param
    : never

type Flatten<T, Separator extends string> = UnionToIntersection<_Flatten<T, Separator>> extends infer O ? { [K in keyof O]: O[K] } : never

type _Flatten<T, Separator extends string, P extends string = ''> = T extends Function | any[]
  ? { [K in P]: T }
  : T extends object
    ? T extends null
      ? { [K in P]: T }
      : {
          [K in keyof T]: _Flatten<T[K], Separator, P extends '' ? K & string : `${P}${Separator}${K & string}`>
        }[keyof T]
    : { [K in P]: T }

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
