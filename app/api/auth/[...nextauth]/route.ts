import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Import bcryptjs
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const prisma = new PrismaClient();

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
					return {
						email: user.email,
						id: user.id,
						username: user.username,
						image: user.image,
						emailVerified: user.email_verified,
						createdAt: user.createdAt,
						updatedAt: user.updatedAt,
					};
				} else {
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ user, token }) {
			if (user) {
				// Note that this if condition is needed
				token.user = { ...user };
			}
			return token;
		},
		async session({ session, token }) {
			if (token?.user) {
				// Note that this if condition is needed
				session.user = token.user;
			}
			return session;
		},
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
