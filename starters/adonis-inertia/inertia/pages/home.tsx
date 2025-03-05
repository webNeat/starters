import { Head } from '@inertiajs/react'
import { Page, Navbar } from '../components/index.js'
import { SharedProps } from '../types.js'

export type Props = SharedProps

export default function ({ user }: Props) {
  return (
    <Page>
      <Navbar user={user} />
      <div className="py-12">
        <Head title="Home" />
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <h1 className="text-2xl font-semibold mb-6">Welcome to My App</h1>
              <p className="text-gray-600">{user ? `Welcome back, ${user.email}!` : 'Please log in or register to get started.'}</p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}
