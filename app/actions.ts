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

		const findUser = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (findUser) {
			throw new Error('Email already exists');
		}

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
		throw error;
	}
}

export default signup;
