'use server';

import { PrismaClient } from '@prisma/client';
import AWS from 'aws-sdk';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';

import { GooglePrediction } from '@/interfaces/models/GooglePrediction';
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
		Key: imageId,
		Body: imageBuffer,
		ContentType: mimeType,
		ACL: 'public-read',
	};

	try {
		const { Location } = await s3.upload(params).promise();
		return Location;
	} catch (error) {
		console.error('Error uploading image to S3:', error);
		throw new Error('Image upload failed');
	}
}

export async function submitSlice(data: PizzaSlice) {
	const errorMsg = pizzaValidation(data);
	if (errorMsg) {
		throw new Error(errorMsg);
	}

	let imageUrl = null;

	try {
		const image = data.image;

		if (image) {
			const strippedImage = image.data.replace(
				/^data:image\/[a-z]+;base64,/,
				'',
			);
			const imageBuffer = Buffer.from(strippedImage, 'base64');
			imageUrl = await uploadImageToS3(imageBuffer, image.type);
		}

		// Check if the pizza place already exists
		let pizzaPlace = await prisma.pizzaPlace.findUnique({
			where: { id: data.pizzaPlace.place_id },
		});

		// If the pizza place doesn't exist, create a new one
		if (!pizzaPlace) {
			pizzaPlace = await prisma.pizzaPlace.create({
				data: {
					id: data.pizzaPlace.place_id,
					description: data.pizzaPlace.description,
					mainText: data.pizzaPlace.structured_formatting.main_text,
					secondaryText: data.pizzaPlace.structured_formatting.secondary_text,
				},
			});
		}

		const newData = {
			...data,
			pizzaPlaceId: pizzaPlace.id,
			image: imageUrl,
		};

		delete newData.pizzaPlace;

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

/**
 * Fetches all pizza slice ratings made by a specific user.
 * @param userId The ID of the user whose pizza slice ratings to retrieve.
 * @returns A list of pizza slice ratings made by the specified user.
 */
export async function getPersonalUserPizzaSliceData(userId: number) {
	try {
		const pizzaSliceRatings = await prisma.pizzaSliceRating.findMany({
			where: {
				userId: userId,
			},
		});
		return pizzaSliceRatings;
	} catch (error) {
		console.error('Error fetching pizza slice ratings for user:', error);
		throw error;
	}
}

/**
 * Fetches all pizza slice ratings in the database along with their associated pizza place data.
 * @returns A list of all pizza slice ratings with pizza place data.
 */
export async function getAllPizzaSliceData() {
	try {
		const pizzaSliceRatings = await prisma.pizzaSliceRating.findMany({
			include: {
				comments: true,
				pizzaPlace: {
					select: {
						mainText: true, // Include only the main text of the pizza place
					},
				},
				user: {
					select: {
						username: true, // Include only the user's name
					},
				},
			},
			orderBy: {
				createdAt: 'desc', // Sort by createdAt in descending order
			},
		});
		return pizzaSliceRatings;
	} catch (error) {
		console.error('Error fetching all pizza slice ratings:', error);
		throw error;
	}
}

export async function searchPizzaPlaces(query: string) {
	try {
		const response = await fetch(
			// eslint-disable-next-line max-len
			`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=establishment&components=country:us&key=${process.env.GOOGLE_PLACES_API_KEY}`,
		);
		const data = await response.json();
		return data.predictions.filter((prediction: GooglePrediction) =>
			prediction.types?.includes('restaurant'),
		);
	} catch (error) {
		console.error('Error fetching data from Google Places API', error);
		throw error;
	}
}

export async function addCommentToPizzaSliceRating({
	pizzaSliceRatingId,
	text,
	userId,
	username,
}: {
	pizzaSliceRatingId: number;
	text: string;
	userId: number;
	username: string;
}) {
	try {
		await prisma.comment.create({
			data: {
				pizzaSliceRatingId,
				text,
				userId,
				username,
			},
		});
		const comments = await prisma.comment.findMany({
			where: {
				pizzaSliceRatingId,
			},
		});
		return comments;
	} catch (error) {
		console.error('Error adding comment:', error);
		throw error;
	}
}
