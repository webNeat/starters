import type { Props as HomeProps } from './pages/home.js'
import type { Props as AccountProps } from './pages/account.js'
import type { Props as LoginProps } from './pages/login.js'
import type { Props as RegisterProps } from './pages/register.js'
import type { Props as ForgotPasswordProps } from './pages/forgot-password.js'
import type { Props as ResetPasswordProps } from './pages/reset-password.js'
import type { Props as ConfirmEmailProps } from './pages/confirm-email.js'

export type User = {
  email: string
  isEmailConfirmed: boolean
}

export type SharedProps = {
  user: User | null
  errors: Record<string, string[]> | null
}
type SharedKeys = keyof SharedProps

export type PageProps = {
  foo: { bar: string }
  home: Omit<HomeProps, SharedKeys> & Partial<SharedProps>
  account: Omit<AccountProps, SharedKeys> & Partial<SharedProps>
  login: Omit<LoginProps, SharedKeys> & Partial<SharedProps>
  register: Omit<RegisterProps, SharedKeys> & Partial<SharedProps>
  'forgot-password': Omit<ForgotPasswordProps, SharedKeys> & Partial<SharedProps>
  'reset-password': Omit<ResetPasswordProps, SharedKeys> & Partial<SharedProps>
  'confirm-email': Omit<ConfirmEmailProps, SharedKeys> & Partial<SharedProps>
}
