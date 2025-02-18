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
  Title,
  Page,
  PageContent,
  Card,
} from '~/components'

export type Props = SharedProps & { key: string }

export default function ({ user, key }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    password: '',
    password_confirmation: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(urls.reset_password.uri({ key }))
  }

  return (
    <Page>
      <Head title="Reset Password" />
      <Navbar user={user} />
      <PageContent>
        <Title>Reset Password</Title>
        <Container>
          <Card>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="password">New Password</Label>
                <InputWrapper>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new password"
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
                {processing ? 'Resetting password...' : 'Reset password'}
              </Button>
            </Form>
          </Card>
        </Container>
      </PageContent>
    </Page>
  )
}
