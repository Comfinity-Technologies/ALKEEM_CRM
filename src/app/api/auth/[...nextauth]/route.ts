import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        // find the guy in our db
        const user = await prisma.user.findUnique({
          where: { email: credentials.username }
        })

        if (!user || !user.password) {
          return null
        }

        // checking if password matches
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          return null
        }

        // return the user obj for the session
        return { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        } as any
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
