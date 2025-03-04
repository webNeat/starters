import router from '@adonisjs/core/services/router'
import { auth } from '#app/actions/index.js'
import { middleware } from './kernel.js'
import { inertia } from '#lib/index.js'
import { urls } from '#inertia/urls.js'

// home page
router.get(urls.home.path, async () => inertia('home', {}))

// auth routes
router.get(urls.register.path, auth.register.page).use(middleware.guest())
router.post(urls.register.path, auth.register.submit).use(middleware.guest())

router.get(urls.login.path, auth.login.page).use(middleware.guest())
router.post(urls.login.path, auth.login.submit).use(middleware.guest())

router.post(urls.logout.path, auth.logout.submit).use(middleware.auth())

router.get(urls.forgot_password.path, auth.forgot_password.page).use(middleware.guest())
router.post(urls.forgot_password.path, auth.forgot_password.submit).use(middleware.guest())
router.get(urls.reset_password.path, auth.reset_password.page)
router.post(urls.reset_password.path, auth.reset_password.submit)

router.get(urls.confirm_email.path, auth.confirm_email.page)

// user routes
router.get(urls.account.path, () => inertia('account', {})).use(middleware.auth())
