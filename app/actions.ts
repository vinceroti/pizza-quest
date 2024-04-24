'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function signup(
	email: string,
	password: string,
	username: string,
) {
	// Optional: Add validation for email, password, and username

	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [{ email }, { username }],
			},
		});

		if (existingUser) {
			if (existingUser.email === email) {
				throw new Error('Email already exists. Please login instead.');
			}

			if (existingUser.username === username) {
				throw new Error('Username already exists. Please try another.');
			}
		}

		const user = await prisma.user.create({
			data: {
				email,
				username,
				password: hashedPassword,
			},
		});

		// Return the created user (excluding the password)
		return {
			id: user.id,
			email: user.email,
			username: user.username,
		};
	} catch (error) {
		throw error;
	}
}

export default signup;
