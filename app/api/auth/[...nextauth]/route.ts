import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Import bcryptjs
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
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
				const prisma = new PrismaClient();

				if (!credentials) {
					return null;
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				console.log('User:', credentials.email);
				if (
					user &&
					(await bcrypt.compare(credentials.password, user.password))
				) {
					// Transform the user object to exclude sensitive and unnecessary fields
					return {
						id: user.id.toString(),
						name: user.name || '', // Use an empty string if name is null
						email: user.email,
						emailVerified: user.emailVerified,
						image: user.image,
					};
				} else {
					return null;
				}
			},
		}),
	],
	pages: {
		signIn: '/auth/signin', // A custom sign-in page
		error: '/auth/error', // Error page
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id;
			return session;
		},
	},
});

export { handler as GET, handler as POST };
