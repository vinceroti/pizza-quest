'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { generatePizzaUsername } from '@/utils';
import { emailValidation, passwordValidation } from '@/utils/validation';

const prisma = new PrismaClient();

export async function signup(
	email: string,
	password: string,
	confirmPassword: string,
) {
	const { isValid: isPasswordValid, passwordErrorMsg } = passwordValidation(
		password,
		confirmPassword,
	);
	const { isValid: isEmailValid, emailErrorMsg } = emailValidation(email);

	if (!isPasswordValid) {
		throw new Error(passwordErrorMsg);
	}

	if (!isEmailValid) {
		throw new Error(emailErrorMsg);
	}

	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [{ email }],
			},
		});

		if (existingUser) {
			throw new Error('Email already exists. Please login instead.');
		}

		const username = await generatePizzaUsername();

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
