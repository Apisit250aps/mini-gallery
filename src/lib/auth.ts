import { betterAuth } from 'better-auth'
import client, { db } from './client'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
})
