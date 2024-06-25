'use server';

import { PrismaClient } from '@prisma/client';
import AWS from 'aws-sdk';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';

import { PizzaSlice } from '@/interfaces/models/PizzaSlice';
import { generatePizzaUsername } from '@/utils';
import {
	emailValidation,
	passwordValidation,
	pizzaValidation,
} from '@/utils/validation';

const prisma = new PrismaClient();

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

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

async function uploadImageToS3(
	imageBuffer: Buffer,
	mimeType: string,
): Promise<string> {
	const imageId = uuidv4();
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME!,
		Key: `${imageId}.${mimeType.split('/')[1]}`, // Extracts file extension from mimeType
		Body: imageBuffer,
		ContentType: mimeType,
		ACL: 'public-read', // Ensure this matches your bucket's policy
	};

	try {
		const { Location } = await s3.upload(params).promise();
		return Location; // URL of the uploaded image
	} catch (error) {
		console.error('Error uploading image to S3:', error);
		throw new Error('Image upload failed');
	}
}

export async function submitSlice(data: PizzaSlice) {
	if (!pizzaValidation(data)) {
		throw new Error('Validation failed: Missing or invalid fields.');
	}

	// Assuming `data.image` contains the base64-encoded image
	// Convert base64 to Buffer for S3 upload
	const imageBuffer = Buffer.from(data.image, 'base64');
	const mimeType = 'image/png'; // This should be dynamically determined based on the actual image type

	try {
		// Upload image to S3 and get the URL
		const imageUrl = await uploadImageToS3(imageBuffer, mimeType);

		// Replace the image data with the URL
		const newData = { ...data, image: imageUrl };

		await prisma.pizzaSliceRating.create({
			data: newData,
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
