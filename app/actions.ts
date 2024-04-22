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

	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		// Create the user in the database
		const user = await prisma.user.create({
			data: {
				email,
				name: username,
				password: hashedPassword,
			},
		});

		// Return the created user (excluding the password)
		return {
			id: user.id,
			email: user.email,
			name: user.name,
		};
	} catch (error) {
		// Handle potential errors, such as duplicate email
		throw new Error('An error occurred during signup. - ' + error.message);
	}
}

export default signup;
