import config from './components/tailwind.config.js'
import { Title, Paragraph, PrimaryButton } from './components/ui.js'
import { Body, Container, Head, Html, Preview, Tailwind, Text } from '@react-email/components'

type Props = {
  reset_password_url: string
}

export function subject(_: Props) {
  return <Text>Reset your password</Text>
}

export function content(props: Props) {
  return (
    <Html>
      <Head />
      <Preview>Forgot your password? Here's how to reset it.</Preview>
      <Tailwind config={config}>
        <Container>
          <Body>
            <Title>Forgot Password</Title>
            <Paragraph>
              We received a request to reset your password. If you did not make this request, no further action is required.
            </Paragraph>
            <Paragraph>
              To reset your password, click the button below. It will take you to a page where you can enter a new password.
            </Paragraph>
            <PrimaryButton href={props.reset_password_url}>Reset Password</PrimaryButton>
          </Body>
        </Container>
      </Tailwind>
    </Html>
  )
}

export default content

content.PreviewProps = {
  reset_password_url: 'https://example.com',
} as Props
