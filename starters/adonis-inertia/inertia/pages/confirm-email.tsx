import { Head } from '@inertiajs/react'
import { urls } from '~/urls.js'
import { SharedProps } from '~/types.js'
import { Container, Card, Title, Text, Navbar, SuccessIcon, Link, Page, PageContent } from '~/components'

export type Props = SharedProps & {}

export default function ConfirmEmail({ user }: Props) {
  return (
    <Page>
      <Navbar user={user} />
      <PageContent>
        <Head title="Email Confirmation" />
        <Title>Email Confirmation</Title>
        <Container>
          <Card>
            <div className="flex flex-col items-center text-center space-y-6">
              <SuccessIcon />
              <Text className="text-xl font-semibold">Email Confirmed!</Text>
              <Text>Your email has been successfully confirmed.</Text>
              <Link href={urls.account.uri()}>Go to your account</Link>
            </div>
          </Card>
        </Container>
      </PageContent>
    </Page>
  )
}
