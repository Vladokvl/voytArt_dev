import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  providers: [], 
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')
      const isLoginPage = nextUrl.pathname === '/admin/login'

      if (isAdminRoute && !isLoginPage && !isLoggedIn) return false
      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL('/admin', nextUrl))
      }
      return true
    },
  },
}