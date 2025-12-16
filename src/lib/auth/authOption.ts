import { authController } from '@/src/controllers/authController';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const result = await authController.login(credentials.username, credentials.password);
        return result
          ? {
              id: result.user.id.toString(),
              email: result.user.email,
              name: result.user.name,
              roles: result.roles.filter((r): r is number => r !== null),
              permissions: result.permissions,
            }
          : null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24, // 1 day
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = Number(token.id);
        session.user.roles = token.roles;
        session.user.permissions = token.permissions;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
};
