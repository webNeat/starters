# Developer Guide for AdonisJS + Inertia + React Project

This guide is intended to help future developers work with this project. It covers setting up new endpoints, creating pages on the frontend, sending emails, handling asynchronous events, and writing tests for actions and events. This guide is designed for junior developers, so it includes detailed and step-by-step instructions.

---

## 1. Project Overview

This project combines **AdonisJS 6** for the backend with **Inertia.js** and **React** for the frontend. It uses Tailwind CSS for styling and is containerized using Docker. The key components are:

- **Backend**: AdonisJS 6 with Node.js 23
- **Frontend**: React with Inertia.js and styled using Tailwind CSS and `react-dye` styled components
- **Database**: PostgreSQL (managed through Lucid ORM)
- **Authentication**: Session based using @adonisjs/auth with email/password and provisions for OAuth.
- **Email**: React-based email templates with previews and MailHog for testing.
- **Async Events**: Handled via the built-in event system using `@adonisjs/core/services/emitter`.

---

## 2. Adding a New Endpoint (Backend)

### 2.1. Define the Route

- Routes are defined in the file `start/routes.ts`.
- Use the helper `urls` (defined in `inertia/urls.ts`) to create paths.
- For example, to add a new GET endpoint:

```typescript
// In start/routes.ts
import { urls } from '#inertia/urls.js'
import { action } from '#lib/index.js'

// Define a new page endpoint
router.get(urls.newPage.path, action(async ({ ctx }) => {
  // Custom logic
  return ctx.response.send('Hello from new endpoint!')
}))
```

### 2.2. Create the Controller

- Place the controller (action) in the folder `app/actions/your_endpoint.ts`.
- Follow the convention used in other actions (see `app/actions/auth/register.ts`).

### 2.3. Export the Action

- Export your action so it can be imported in `start/routes.ts` or the general actions index.

---

## 3. Adding a New Page on the Frontend

### 3.1. Create the Page Component

- Place the new page in `inertia/pages/yourPage.tsx`.
- **Frontend Page Guidelines:**
  - The page should export a default React component for rendering.
  - Also export a `Props` type (using `type` rather than `interface`) for component properties.

Example:

```tsx
// inertia/pages/yourPage.tsx
import { Head } from '@inertiajs/react'
import { SharedProps } from '~/types'

export type Props = SharedProps & {
  data: string
}

export default function YourPage({ data, user }: Props) {
  return (
    <div>
      <Head title="Your Page" />
      <h1>Your New Page</h1>
      <p>{data}</p>
    </div>
  )
}
```

### 3.2. Connect the Page with its Action

- Create an action controller in `app/actions/yourPage.ts` that handles the server-side logic; for instance, fetching data for the page.
- The action can then return `inertia('yourPage', { data: 'Hello' })` to bind your component with server-side data.

---

## 4. Creating and Sending Emails

### 4.1. Email Templates

- Email templates are created as React components and stored in the `emails/` directory.
- There are separate templates, such as `welcome.tsx` and `email_confirmed.tsx`.
- Styled components in emails also use `react-dye` for consistency, and shared components are located in `emails/components/`.

### 4.2. Sending Emails

- The function `send_email.ts` (in `app/functions/`) is used to send emails. It utilizes the `mail` service.
- For example, the `welcome` email is sent by creating a `UserSecret` with a random key and sending an email with a confirmation URL:

```typescript
export async function welcome(user: User) {
  const secret = await UserSecret.create({ userId: user.id, value: string.random(48) })
  await send(user, emails.welcome({ confirmation_url: urls.confirm_email.uri({ key: secret.value }) }))
}
```

- You can create new email templates following the pattern used in existing templates. Export a `subject` function and a `content` component.

---

## 5. Handling Async Events

### 5.1. Defining Events

- Events are defined in the `app/events/` directory. For example, see `app/events/user.ts` which handles events like `user:created` and `user:confirmed_email`.
- Each event handler is an asynchronous function that performs operations such as sending emails.

### 5.2. Registering Events

- Event bindings are completed in `start/events.ts`. Here, the emitter listens for events and routes them to corresponding handlers.

```typescript
emitter.on('user:created', events.user.created)
emitter.on('user:confirmed_email', events.user.confirmed_email)
```

### 5.3. Emitting Events

- From your action controllers (e.g., after a new user registers), emit events as needed:

```typescript
await emitter.emit('user:created', { user })
```

---

## 6. Writing Tests for Actions and Events

### 6.1. Test Structure

- Test files are organized under `tests/functional/actions/`. For each endpoint, there should typically be two tests:
  - A `page.spec.ts` for GET requests (page rendering).
  - A `submit.spec.ts` for POST/PUT/DELETE requests (form submissions).

### 6.2. Testing GET Requests

- Use the `@japa/runner` for writing tests. An example for a page test is:

```typescript
import { test } from '@japa/runner'

test.group('New Page', () => {
  test('renders new page for anonymous users', async ({ client, expect }) => {
    const res = await client.get('/new-page').withInertia()
    expect(res.status()).toBe(200)
    // Assert the correct Inertia page was rendered
  })
})
```

### 6.3. Testing Form Submissions

- For form submission tests, construct tests that simulate user form submissions, check validations, and verify redirection or database state.

```typescript
import { test } from '@japa/runner'

test.group('Form Submission', () => {
  test('submits form successfully', async ({ client, expect }) => {
    const res = await client.post('/form-endpoint')
      .withInertia()
      .withCsrfToken()
      .form({ field: 'value' })
    res.assertRedirectsTo('/success-path')
  })
})
```

### 6.4. Testing Async Events

- To test async events, you can use event spies or helper functions (e.g., `expect_event()`) that verify if the event was emitted and handled.

```typescript
// Example usage within a test:
await expect_event({ event: 'user:created', handler: events.user.created }, async () => {
  // trigger action that emits event
})
```

---

## 7. General Project Conventions and Styling

- **Frontend Styling with react-dye:**
  - All styled components on the frontend are built using `react-dye` and are stored inside the `components` folder.
  - Maintain a consistent style by reusing components (e.g., `Container`, `Card`, `Form`, `Button`, etc.)

- **TypeScript Types:**
  - Use `type` for defining shapes unless you specifically need features provided by `interface` (such as declaration merging).

- **File Structure Conventions:**
  - Frontend pages: `inertia/pages/`
  - Backend action controllers: `app/actions/`
  - Event handlers: `app/events/`
  - Email templates: `emails/`

- **Docker and Testing:**
  - Use the provided Docker scripts for local development and testing:
    - `./docker dev` for running the development environment
    - `./docker test` for running tests

- **Documentation and Help:**
  - Refer to local documentation files such as `.ai/adonis` for AdonisJS documentation, and use external links for Inertia (https://inertiajs.com) when needed.

---

## 8. Summary

This guide covers:
- How to add a new endpoint by defining routes, creating controllers, and updating the actions index.
- How to add a new frontend page, connect it to backend actions, and manage props.
- How to create and send emails using React email templates and the `send_email` functions.
- How to handle async events with the emitter system in AdonisJS.
- How to write tests for both GET and POST endpoints, and verify event handling with Japa tests.

By following these detailed steps, developers should be able to extend the project with new features while maintaining consistency in code structure and functionality.

---

## 9. Real-World Examples

### 9.1. Authentication Flow Example

Below is a complete example of how different parts of the application work together in the registration flow:

1. **Frontend (inertia/pages/register.tsx):**

```typescript
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
  // ... form JSX
}
```

2. **Backend Action (app/actions/auth/register.ts):**

```typescript
export const submit = action({
  body: vine.object({
    email: vine.string().email().normalizeEmail().unique({
      table: 'users',
      column: 'email',
    }),
    password: vine.string().minLength(8),
    password_confirmation: vine.string().confirmed({ confirmationField: 'password' }),
  }),

  async handle({ ctx, body }) {
    const user = await User.create({
      email: body.email,
      password: body.password,
      isEmailConfirmed: false,
    })
    await emitter.emit('user:created', { user })
    await ctx.auth.use('web').login(user, true)
    return ctx.response.redirect(urls.account.uri())
  },
})
```

3. **Event Handler (app/events/user.ts):**

```typescript
export async function created({ user }: { user: User }) {
  await send_email.welcome(user)
}
```

4. **Email Template (emails/welcome.tsx):**

```typescript
export function content(props: { confirmation_url: string }) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for joining us! Please confirm your email.</Preview>
      <Tailwind config={config}>
        <Container>
          <Body>
            <Title>Welcome!</Title>
            <PrimaryButton href={props.confirmation_url}>Confirm Email</PrimaryButton>
          </Body>
        </Container>
      </Tailwind>
    </Html>
  )
}
```

5. **Tests (tests/functional/actions/auth/register.spec.ts):**

```typescript
test('creates a new user and logs them in', async ({ client, expect, events }) => {
  const { email, password } = await UserFactory.make()
  const res = await client
    .post(urls.register.uri())
    .withInertia()
    .withCsrfToken()
    .form({ email, password, password_confirmation: password })

  // Verify user creation
  const user = await User.findByOrFail('email', email)

  // Verify login
  res.assertRememberMeCookie(true)
  res.assertRedirectsTo(urls.account.uri())

  // Verify event emission
  expect_event('user:created', (data) => {
    expect(data.user.id).toEqual(user.id)
  })
})
```

### 9.2. Development Workflow

1. **Starting Development:**

```bash
# Start all services
./docker dev

# Services:
# - App: http://localhost:3001
# - Email Preview: http://localhost:3002
# - MailHog: http://localhost:3003
```

2. **Running Tests:**

```bash
# Run all tests
./docker test

# Run specific tests
./docker test tests/functional/actions/auth/login.spec.ts

# Run tests in watch mode
./docker test -w
```

3. **Database Migrations:**

```bash
# Run migrations
./docker node ace migration:run

# Create a new migration
./docker node ace make:migration create_some_table
