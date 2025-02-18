import app from '@adonisjs/core/services/app'

export const counter = await app.container.make('counter')
