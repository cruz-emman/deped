import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config";
import { db } from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.affiliation = token.affiliation as string;
    
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        //@ts-ignore
        token.affiliation = user.affiliation;

        
      } else if (token.sub) {
        const existingUser = await db.user.findUnique({
          where: { id: token.sub },
          select: {
            role: true,
            affiliation: true
          }
        });

        if (existingUser) {
          token.role = existingUser.role;
          //@ts-ignore
          token.affiliation = existingUser.affiliation;
        }
      }
      return token;
    },
  },
  adapter: PrismaAdapter(db) as any, // Type assertion to bypass the type error temporarily
  session: { strategy: "jwt" },
  ...authConfig,
});