import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Import bcryptjs
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
const prisma = new PrismaClient();
import { type Session } from 'next-auth';

export const authOptions: NextAuthOptions = {
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
		async jwt({ user, token }) {
			if (user) {
				token.user = { ...user };
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
