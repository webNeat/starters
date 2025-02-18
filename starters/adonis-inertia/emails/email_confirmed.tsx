import { Body, Container, Head, Html, Preview, Tailwind, Text } from '@react-email/components'
import config from './components/tailwind.config.js'
import { Title, Paragraph, PrimaryButton } from './components/ui.js'

type Props = {}

export function subject(_: Props) {
  return <Text>Your email has been confirmed</Text>
}

export function content(props: Props) {
  return (
    <Html>
      <Head />
      <Tailwind config={config}>
        <Container>
          <Body>
            <Title>Your email has been confirmed</Title>
            <Paragraph>Thank you for confirming your email address.</Paragraph>
          </Body>
        </Container>
      </Tailwind>
    </Html>
  )
}

export default content

content.PreviewProps = {} as Props
