import { ReactNode } from 'react'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi2'
import { Link as InertiaLink } from '@inertiajs/react'
import { dye } from '../libs.js'

// Layout components
export const Page = dye('min-h-screen bg-gray-100')
export const PageContent = dye('flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8')
export const Container = dye('mt-8 sm:mx-auto sm:w-full sm:max-w-md')
export const Card = dye('bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10')

// Form components
export const Form = dye('space-y-6', 'form')
export const FormGroup = dye('space-y-1')
export const Label = dye('block text-sm font-medium text-gray-700', 'label')
export const InputWrapper = dye('mt-1')

export const Input = dye(
  'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none',
  {
    default: 'border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500',
    error: 'border-red-300 placeholder-red-400 focus:ring-red-500 focus:border-red-500',
  },
  'input',
)

export const ErrorMessage = dye('mt-2 text-sm text-red-600', 'p')

// Button components
const buttonStyles =
  'w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

export const Button = dye(
  buttonStyles,
  {
    primary: 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500',
    danger: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
    success: 'border-transparent text-white bg-green-600 hover:bg-green-700 focus:ring-green-500',
  },
  'button',
)

export const ButtonLink = Button.as(InertiaLink as any)

export const SocialButton = Button.extend('', {
  default: 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50',
  google: 'border-transparent bg-[#ea4335] text-white hover:bg-[#d62516]',
  github: 'border-transparent bg-black text-white hover:bg-gray-900',
})

// Icon components
export const StatusIcon = dye('w-16 h-16')
export const CheckCircleIcon = StatusIcon.as(HiCheckCircle)
export const XCircleIcon = StatusIcon.as(HiXCircle)

export function SuccessIcon(props: React.ComponentProps<typeof CheckCircleIcon>) {
  return <CheckCircleIcon className="text-green-500" {...props} />
}

export function ErrorIcon(props: React.ComponentProps<typeof XCircleIcon>) {
  return <XCircleIcon className="text-red-500" {...props} />
}

// Text components
export const Text = dye('text-sm text-gray-600', 'p')
export const Link = dye('font-medium text-indigo-600 hover:text-indigo-500', 'a')
export const Title = dye('mt-6 text-center text-3xl font-extrabold text-gray-900', 'h1')

// Navbar components
export const Nav = dye('bg-white shadow-sm', 'nav')
export const NavContainer = dye('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', 'div')
export const NavContent = dye('flex justify-between h-16', 'div')
export const NavLinks = dye('flex space-x-4 items-center', 'div')
export const NavLink = dye('text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium', InertiaLink as any)
export const NavLinkActive = dye('bg-gray-100 text-gray-900 px-3 py-2 rounded-md text-sm font-medium', InertiaLink as any)

export function GoogleButton(props: React.ComponentProps<typeof SocialButton>) {
  return (
    <SocialButton variant="google" {...props}>
      <FaGoogle className="w-5 h-5" />
    </SocialButton>
  )
}

export function GithubButton(props: React.ComponentProps<typeof SocialButton>) {
  return (
    <SocialButton variant="github" {...props}>
      <FaGithub className="w-5 h-5" />
    </SocialButton>
  )
}

export function Divider({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-white text-gray-500">{children}</span>
      </div>
    </div>
  )
}
