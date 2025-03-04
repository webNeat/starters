import React from 'react'
import { render } from '@react-email/render'

export type ReactComponent<Props> = (props: Props) => React.JSX.Element
export type Email<Props> = {
  subject: ReactComponent<Props>
  content: ReactComponent<Props>
}
export type InferProps<E extends Email<any>> = E extends Email<infer Props> ? Props : never
export type EmailRenderResult = { subject: string; html: string; text: string }
export type EmailRenderer<E extends Email<any>> = (props: InferProps<E>) => Promise<EmailRenderResult>
export type EmailRenderers<Emails extends Record<string, Email<any>>> = {
  [K in keyof Emails]: EmailRenderer<Emails[K]>
}

export function react_emails<Emails extends Record<string, Email<any>>>(emails: Emails): EmailRenderers<Emails> {
  const renderers = {} as EmailRenderers<Emails>
  for (const [name, component] of Object.entries(emails)) {
    renderers[name as keyof Emails] = async (props: any) => {
      const subject_jsx = component.subject(props)
      const content_jsx = component.content(props)
      const [subject, html, text] = await Promise.all([
        render(subject_jsx, { plainText: true }),
        render(content_jsx),
        render(content_jsx, { plainText: true }),
      ])
      return { subject, html, text }
    }
  }
  return renderers
}
