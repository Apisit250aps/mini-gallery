import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth(async () => {
  return NextResponse.next()
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
