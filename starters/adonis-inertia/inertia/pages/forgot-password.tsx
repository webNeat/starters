import { Head, useForm } from '@inertiajs/react'
import { SharedProps } from '../types.js'
import { urls } from '../urls.js'
import {
  Navbar,
  Button,
  Container,
  ErrorMessage,
  Form,
  FormGroup,
  Input,
  InputWrapper,
  Label,
  Page,
  PageContent,
  Title,
  Card,
  Text,
} from '../components/index.js'

export type Props = SharedProps & {
  state: 'form' | 'sent'
}

export default function ({ user, state }: Props) {
  return (
    <Page>
      <Navbar user={user} />
      <PageContent>
        <Head title="Forgot Password" />
        <Title>Forgot Password</Title>
        <Container>
          <Card>
            {state === 'form' && <ForgotPasswordForm />}
            {state === 'sent' && <ForgotPasswordSent />}
          </Card>
        </Container>
      </PageContent>
    </Page>
  )
}

function ForgotPasswordForm() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(urls.forgot_password.uri())
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="email">Email address</Label>
        <InputWrapper>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={data.email}
            onChange={(e: any) => setData('email', e.target.value)}
            variant={errors.email ? 'error' : 'default'}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </InputWrapper>
      </FormGroup>
      <Button type="submit" disabled={processing} variant="primary">
        {processing ? 'Resetting password...' : 'Reset password'}
      </Button>
    </Form>
  )
}

function ForgotPasswordSent() {
  return <Text>We have sent a password reset link to your email. Please check your email and click on the link to reset your password.</Text>
}
