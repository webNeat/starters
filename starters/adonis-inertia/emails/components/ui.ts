import { dye } from 'react-dye'
import { Button, Heading, Text } from '@react-email/components'

export const Title = dye('text-2xl font-bold mb-4', Heading)
export const Paragraph = dye('mb-6', Text)
export const PrimaryButton = dye('bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 cursor-pointer', Button)
