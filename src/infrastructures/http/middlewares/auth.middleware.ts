import { Context, Next } from 'hono'
import { auth } from '@/lib/auth'
import { UnauthorizedError } from '@/lib/applications'

/**
 * requireAuth — Hono middleware that validates the Better-Auth session.
 *
 * On success, sets `c.var.user` to the authenticated user object so
 * downstream handlers can read it via `c.var.user`.
 *
 * On failure, throws an UnauthorizedError (handled by the global
 * error handler registered in the Hono app).
 */
export async function requireAuth(c: Context, next: Next): Promise<void | Response> {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  if (!session?.user) {
    throw new UnauthorizedError('You must be logged in to access this resource')
  }

  c.set('user', session.user)

  await next()
}
