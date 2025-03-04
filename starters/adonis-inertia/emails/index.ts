import { react_emails } from '#lib/react_emails.js'
import * as welcome from './welcome.js'
import * as email_confirmed from './email_confirmed.js'
import * as reset_password from './reset_password.js'

export default react_emails({ welcome, email_confirmed, reset_password })
