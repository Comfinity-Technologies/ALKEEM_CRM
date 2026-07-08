import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const adminUser = process.env.ADMIN_USERNAME || "admin"
        const adminPass = process.env.ADMIN_PASSWORD || "admin"
        const superUser = process.env.SUPER_USERNAME || "super"
        const superPass = process.env.SUPER_PASSWORD || "super"

        if (credentials?.username === adminUser && credentials?.password === adminPass) {
          return { id: "1", name: "Admin", email: "admin@al-alkeem.com", role: "admin" } as any
        }
        if (credentials?.username === superUser && credentials?.password === superPass) {
          return { id: "2", name: "Super Admin", email: "super@al-alkeem.com", role: "super" } as any
        }
        return null
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
