import { url } from '#lib/url.js'

export const urls = {
  home: url('/'),
  register: url('/register'),
  login: url('/login'),
  logout: url('/logout'),
  account: url('/account'),
  confirm_email: url(`/confirm-email`, ['key']),
  reset_password: url('/reset-password', ['key']),
  forgot_password: url('/forgot-password'),
}
