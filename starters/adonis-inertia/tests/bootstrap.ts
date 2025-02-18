import { assert } from '@japa/assert'
import { expect } from '@japa/expect'
import { apiClient } from '@japa/api-client'
import app from '@adonisjs/core/services/app'
import type { Config } from '@japa/runner/types'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import { shieldApiClient } from '@adonisjs/shield/plugins/api_client'
import { sessionApiClient } from '@adonisjs/session/plugins/api_client'
import { inertiaApiClient } from '@adonisjs/inertia/plugins/api_client'
import { authApiClient } from '@adonisjs/auth/plugins/api_client'
import testUtils from '@adonisjs/core/services/test_utils'
import { tests_plugin } from '#lib/tests.js'
import * as services from '#app/services/index.js'

export const plugins: Config['plugins'] = [
  assert(),
  expect(),
  pluginAdonisJS(app),
  apiClient(),
  inertiaApiClient(app),
  sessionApiClient(app),
  shieldApiClient(),
  authApiClient(app),
  tests_plugin({ services }),
]

/**
 * Configure lifecycle function to run before and after all the
 * tests.
 *
 * The setup functions are executed before all the tests
 * The teardown functions are executed after all the tests
 */
export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [],
  teardown: [],
}

/**
 * Configure suites by tapping into the test suite instance.
 * Learn more - https://japa.dev/docs/test-suites#lifecycle-hooks
 */
export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'functional', 'e2e'].includes(suite.name)) {
    return suite.setup(() => testUtils.httpServer().start())
  }
}
