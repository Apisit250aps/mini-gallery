import 'dotenv/config'
import { auth } from '../src/lib/auth'
import z from 'zod'

async function main() {
  const userSchema = z.object({
    email: z.email(),
    name: z.string(),
    password: z.string().min(8),
  })

  const init = userSchema.safeParse({
    email: process.env.ADMIN_EMAIL,
    name: process.env.ADMIN_NAME,
    password: process.env.ADMIN_PASSWORD,
  })

  if (!init.success) {
    console.error('Invalid input:', init.error.format())
    process.exit(1)
  }

  await auth.api.signUpEmail({
    body: {
      email: init.data.email,
      password: init.data.password,
      name: init.data.name,
      callbackURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    },
  })

  console.log('Admin user created successfully')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
