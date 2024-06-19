'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { PizzaSlice } from '@/interfaces/models/PizzaSlice';
import { generatePizzaUsername } from '@/utils';
import {
	emailValidation,
	passwordValidation,
	pizzaValidation,
} from '@/utils/validation';

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

		await prisma.user.create({
			data: {
				email,
				username,
				password: hashedPassword,
			},
		});

		return {
			success: true,
			user: {
				email,
				username,
			},
			message: 'User successfully created. Please log in.',
		};
	} catch (error) {
		throw error;
	}
}

export async function sessionRedirect() {
	const session = await getServerSession();
	if (session) {
		redirect('/dashboard');
	}
}

export async function protectedRedirect() {
	const session = await getServerSession();
	if (!session) {
		redirect('/');
	}
}
export async function submitSlice(data: PizzaSlice) {
	if (!pizzaValidation(data)) {
		throw new Error('Validation failed: Missing or invalid fields.');
	}

	try {
		await prisma.pizzaSliceRating.create({
			data,
		});

		return {
			success: true,
			message: 'Pizza slice rating successfully submitted.',
		};
	} catch (error) {
		console.error('Error submitting pizza slice rating:', error);
		throw new Error('Failed to submit pizza slice rating.');
	}
}
