import authConfig from "@/auth.config"
import NextAuth from "next-auth"

const { auth } = NextAuth(authConfig)



export const publicRoutes = [
]

export const authRoutes = [
  "/login",
  "/register",
]

export const DEFAULT_LOGIN_AS_USERS = "/myaccount"
export const DEFAULT_LOGIN_REDIRECT = "/main"

//@ts-ignore
export default auth((req) => {
  const { nextUrl, auth: user } = req
  const isLoggedIn = !!req.auth

  

  
  console.log("IS LOGGEDIN: ", isLoggedIn)

  const apiAuthPrefix = '/api/auth'
  const isApiRoute = nextUrl.pathname.startsWith('/api')



  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)


  if (isApiRoute && !isApiAuthRoute) {
    return null;
  }


  const isAuthRoutes = authRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    return null;
  }

  if (nextUrl.pathname === '/' && isLoggedIn) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }
  

  if (isAuthRoutes) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null
  }

  

  if (!isLoggedIn ) {
    return Response.redirect(new URL('/login', nextUrl))
  }

  return null;
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],

}