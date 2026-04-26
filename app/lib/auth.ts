import bcrypt from 'bcryptjs';
import { type NextAuthOptions, type Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import prisma from '@/app/lib/prisma';

export const authOptions: NextAuthOptions = {
	pages: {
		signIn: '/',
	},
	providers: [
		CredentialsProvider({
			credentials: {
				email: {
					label: 'Email',
					type: 'text',
					placeholder: 'jsmith@example.com',
				},
				password: { label: 'Password', type: 'password' },
			},
			authorize: async (credentials) => {
				if (!credentials) {
					return null;
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				if (
					user &&
					(await bcrypt.compare(credentials.password, user.password))
				) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					return user as any;
				} else {
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ user, token, trigger, session }) {
			if (user) {
				token.user = { ...user };
			}
			// Merge client-side `update({...})` payloads into the JWT so
			// useSession() reflects new email/username/image without a re-login.
			if (trigger === 'update' && session) {
				token.user = {
					...((token.user as Record<string, unknown> | undefined) ?? {}),
					...session,
				};
			}
			return token;
		},
		async session({ session, token }) {
			if (token?.user) {
				session.user = token.user as Session['user'];
			}
			return session;
		},
	},
};
