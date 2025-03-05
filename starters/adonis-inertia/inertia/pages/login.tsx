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
  Link,
  Text,
  Card,
} from '../components/index.js'

export type Props = SharedProps

export default function ({ user }: Props) {
  const { data, setData, post, processing, errors, hasErrors } = useForm({
    email: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(urls.login.uri())
  }

  return (
    <Page>
      <Navbar user={user} />
      <PageContent>
        <Head title="Login" />
        <Title>Sign in to your account</Title>
        <Container>
          <Card>
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

              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <InputWrapper>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={data.password}
                    onChange={(e: any) => setData('password', e.target.value)}
                    variant={errors.password ? 'error' : 'default'}
                  />
                  {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                </InputWrapper>
              </FormGroup>
              <Button type="submit" disabled={processing} variant="primary">
                {processing ? 'Signing in...' : 'Sign in'}
              </Button>
              {hasErrors && <ErrorMessage>Invalid credentials</ErrorMessage>}
            </Form>
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <Text>
                  Don't have an account? <Link href={urls.register.uri()}>Sign up</Link>
                </Text>
              </div>
              <div className="text-center">
                <Link href={urls.forgot_password.uri()}>Forgot your password?</Link>
              </div>
            </div>
          </Card>
        </Container>
      </PageContent>
    </Page>
  )
}
