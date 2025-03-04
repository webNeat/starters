import { ApplicationService } from '@adonisjs/core/types'
import { ServiceClass, FakeClass, ServiceOptions } from './types.js'

export function service_provider<Options extends ServiceOptions<any, any, any>>(options: Options) {
  const Service = create_service_class(options.class, options.fake)
  return class {
    constructor(protected app: ApplicationService) {}
    register() {
      this.app.container.bind(options.name as any, async (resolver) => {
        const config = await resolver.make('config')
        const instance = new Service(config.get(options.name))
        return instance
      })
    }
  }
}

function create_service_class<Config>(Class: ServiceClass<Config>, Fake: FakeClass) {
  class CreatedService {
    protected instance: InstanceType<typeof Class>
    protected fakeInstance: InstanceType<typeof Fake> | undefined
    constructor(protected config: Config) {
      this.instance = new Class(config)
      this.fakeInstance = undefined
    }

    fake() {
      if (!this.fakeInstance) {
        this.fakeInstance = new Fake()
      }
      return this.fakeInstance
    }
    restore() {
      if (this.fakeInstance) {
        this.fakeInstance = undefined
      }
    }
  }

  const class_methods = get_methods(Class)
  for (const name of Object.keys(class_methods.static_methods)) {
    ;(CreatedService as any)[name] = class_methods.static_methods[name]
  }
  for (const name of Object.keys(class_methods.instance_methods)) {
    ;(CreatedService.prototype as any)[name] = function (...args: any[]) {
      if (this.fakeInstance) {
        return this.fakeInstance[name](...args)
      } else {
        return this.instance[name](...args)
      }
    }
  }

  return CreatedService
}

function get_methods(Class: Function) {
  const static_methods = {} as any
  for (const name of Object.getOwnPropertyNames(Class)) {
    const value = (Class as any)[name]
    if (typeof value !== 'function') continue
    static_methods[name] = value
  }

  const instance_methods = {} as any
  for (const name of Object.getOwnPropertyNames(Class.prototype)) {
    const value = (Class.prototype as any)[name]
    if (typeof value !== 'function' || name === 'constructor') continue
    instance_methods[name] = value
  }

  return { static_methods, instance_methods }
}
