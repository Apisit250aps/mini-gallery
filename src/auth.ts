import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { userRepository } from './core/repositories'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        name: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const { name, password } = credentials as {
          name: string
          password: string
        }

        if (!name || !password) {
          return null
        }

        console.log('Attempting login with credentials:', { name, password })

        const login = await userRepository.login({
          name,
          password,
        })

        return login
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.isAdmin = user.isAdmin
        token.isActive = user.isActive
        token.lastLogin = user.lastLogin
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.isAdmin = token.isAdmin as boolean
        session.user.isActive = token.isActive as boolean
        session.user.lastLogin = token.lastLogin as Date
      }
      return session
    },
  },
})
