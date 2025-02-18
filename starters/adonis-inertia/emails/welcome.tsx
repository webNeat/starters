import { Body, Container, Head, Html, Preview, Tailwind, Text } from '@react-email/components'
import config from './components/tailwind.config.js'
import { Title, Paragraph, PrimaryButton } from './components/ui.js'

type Props = {
  confirmation_url: string
}

export function subject(_: Props) {
  return <Text> Confirm your email address</Text>
}

export function content(props: Props) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for joining us! Please confirm your email.</Preview>
      <Tailwind config={config}>
        <Container>
          <Body>
            <Title>Welcome!</Title>
            <Paragraph>
              Thank you for signing up with us. To complete your registration, please confirm your email address by clicking the button
              below.
            </Paragraph>
            <PrimaryButton href={props.confirmation_url}>Confirm Email</PrimaryButton>
          </Body>
        </Container>
      </Tailwind>
    </Html>
  )
}

export default content

content.PreviewProps = {
  confirmation_url: 'https://example.com',
} as Props
