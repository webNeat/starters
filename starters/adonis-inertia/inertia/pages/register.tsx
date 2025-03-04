import { Head, useForm } from '@inertiajs/react'
import { SharedProps } from '~/types'
import { urls } from '~/urls'
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
  Link,
  Text,
  Title,
  Page,
  PageContent,
  Card,
} from '~/components'

export type Props = SharedProps

export default function ({ user }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    password_confirmation: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(urls.register.uri())
  }

  return (
    <Page>
      <Navbar user={user} />
      <PageContent>
        <Head title="Register" />
        <Title>Create your account</Title>
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
                    onChange={(e) => setData('email', e.target.value)}
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
                    autoComplete="new-password"
                    required
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    variant={errors.password ? 'error' : 'default'}
                  />
                  {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <InputWrapper>
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    variant={errors.password_confirmation ? 'error' : 'default'}
                  />
                  {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation}</ErrorMessage>}
                </InputWrapper>
              </FormGroup>

              <Button type="submit" disabled={processing} variant="primary">
                {processing ? 'Creating account...' : 'Create account'}
              </Button>
            </Form>

            <div className="mt-6">
              <div className="text-center">
                <Text>
                  Already have an account? <Link href={urls.login.uri()}>Sign in</Link>
                </Text>
              </div>
            </div>
          </Card>
        </Container>
      </PageContent>
    </Page>
  )
}
