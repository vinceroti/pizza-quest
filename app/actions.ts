'use server';

import AWS from 'aws-sdk';
import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import GooglePrediction from '@/interfaces/models/GooglePrediction';
import { PizzaSlice } from '@/interfaces/models/PizzaSlice';
import { generatePizzaUsername } from '@/utils';
import {
	emailValidation,
	passwordValidation,
	pizzaValidation,
	usernameValidation,
} from '@/utils/validation';

const ALLOWED_IMAGE_TYPES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif',
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_APP_PASSWORD,
	},
});

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

async function getAuthenticatedUser() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		throw new Error('Authentication required');
	}
	return session.user;
}

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
	const session = await getServerSession(authOptions);
	if (session) {
		redirect('/dashboard');
	}
}

export async function protectedRedirect() {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect('/');
	}
}

async function uploadImageToS3(
	imageBuffer: Buffer,
	mimeType: string,
	subFolder: string,
): Promise<string> {
	if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
		throw new Error(
			'Invalid image type. Allowed types: JPEG, PNG, WebP, GIF',
		);
	}
	if (imageBuffer.length > MAX_IMAGE_SIZE) {
		throw new Error('Image size exceeds 5MB limit');
	}

	const imageId = uuidv4();
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME!,
		Key: `${subFolder}/${imageId}`,
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

export async function submitSlice(data: Omit<PizzaSlice, 'userId'>) {
	const user = await getAuthenticatedUser();
	const errorMsg = pizzaValidation(data);
	if (errorMsg) {
		throw new Error(errorMsg);
	}

	try {
		const image = data.image;

		const strippedImage = image.data.replace(/^data:image\/[a-z]+;base64,/, '');
		const imageBuffer = Buffer.from(strippedImage, 'base64');
		const imageUrl = await uploadImageToS3(
			imageBuffer,
			image.type,
			'pizza-slices',
		);

		let pizzaPlace = await prisma.pizzaPlace.findUnique({
			where: { id: data.pizzaPlace.place_id },
		});

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

		await prisma.pizzaSliceRating.create({
			data: {
				overall: data.overall,
				crustDough: data.crustDough,
				sauce: data.sauce,
				toppingToPizzaRatio: data.toppingToPizzaRatio,
				creativity: data.creativity,
				authenticity: data.authenticity,
				notes: data.notes,
				userId: user.id,
				pizzaPlaceId: pizzaPlace.id,
				image: imageUrl,
			},
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

export async function getPersonalUserPizzaSliceData() {
	const user = await getAuthenticatedUser();
	try {
		const pizzaSliceRatings = await prisma.pizzaSliceRating.findMany({
			where: {
				userId: user.id,
			},
		});
		return pizzaSliceRatings;
	} catch (error) {
		console.error('Error fetching pizza slice ratings for user:', error);
		throw error;
	}
}

export async function getAllPizzaSliceData(userId?: number) {
	try {
		const pizzaSliceRatings = await prisma.pizzaSliceRating.findMany({
			where: userId ? { userId } : undefined,
			include: {
				likes: true,
				comments: true,
				pizzaPlace: {
					select: {
						mainText: true,
					},
				},
				user: {
					select: {
						username: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
		return pizzaSliceRatings;
	} catch (error) {
		console.error('Error fetching pizza slice ratings:', error);
		throw error;
	}
}

export async function getAllPizzaPlacesWithRatings() {
	try {
		const pizzaPlaces = await prisma.pizzaPlace.findMany({
			include: {
				pizzaSliceRatings: {
					include: {
						user: {
							select: {
								username: true,
								image: true,
							},
						},
						comments: true,
						likes: true,
					},
				},
			},
		});

		const averageRatings: { [key: string]: number } = {};
		pizzaPlaces.forEach((place) => {
			averageRatings[place.id] = place.pizzaSliceRatings.reduce(
				(acc, rating) => acc + rating.overall,
				0,
			);
			averageRatings[place.id] /= place.pizzaSliceRatings.length;
		});

		return { pizzaPlaces, averageRatings };
	} catch (error) {
		console.error('Error fetching pizza places with ratings:', error);
		throw error;
	}
}

export async function searchPizzaPlaces(query: string) {
	try {
		const baseUrl =
			'https://maps.googleapis.com/maps/api/place/autocomplete/json';
		const params = new URLSearchParams({
			input: query,
			types: 'establishment',
			components: 'country:us',
			key: process.env.GOOGLE_PLACES_API_KEY || '',
		});
		const response = await fetch(`${baseUrl}?${params.toString()}`);
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
}: {
	pizzaSliceRatingId: number;
	text: string;
}) {
	const user = await getAuthenticatedUser();
	try {
		await prisma.comment.create({
			data: {
				pizzaSliceRatingId,
				text,
				userId: user.id,
				username: user.username,
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

export async function addLikeToPizzaSliceRating({
	pizzaSliceRatingId,
}: {
	pizzaSliceRatingId: number;
}) {
	const user = await getAuthenticatedUser();
	try {
		await prisma.like.create({
			data: {
				pizzaSliceRatingId,
				userId: user.id,
				username: user.username,
			},
		});
		const likes = await prisma.like.findMany({
			where: {
				pizzaSliceRatingId,
			},
		});
		return likes;
	} catch (error) {
		console.error('Error adding like:', error);
		throw error;
	}
}

export async function removeLikeFromPizzaSliceRating({
	pizzaSliceRatingId,
}: {
	pizzaSliceRatingId: number;
}) {
	const user = await getAuthenticatedUser();
	try {
		await prisma.like.deleteMany({
			where: {
				pizzaSliceRatingId,
				userId: user.id,
			},
		});
		const likes = await prisma.like.findMany({
			where: {
				pizzaSliceRatingId,
			},
		});
		return likes;
	} catch (error) {
		console.error('Error removing like:', error);
		throw error;
	}
}

export async function userSettingsChange({
	email,
	username,
}: {
	email: string;
	username: string;
}) {
	const authenticatedUser = await getAuthenticatedUser();
	const { isValid: isEmailValid, emailErrorMsg } = emailValidation(email);
	const { isValid: isUsernameValid, usernameErrorMsg } =
		usernameValidation(username);

	if (!isEmailValid) {
		throw new Error(emailErrorMsg);
	}

	if (!isUsernameValid) {
		throw new Error(usernameErrorMsg);
	}

	try {
		const existingUser = await prisma.user.findFirst({
			where: {
				email,
				id: {
					not: authenticatedUser.id,
				},
			},
		});

		if (existingUser) {
			throw new Error('Email already exists. Please use a different email.');
		}

		const user = await prisma.user.update({
			where: {
				id: authenticatedUser.id,
			},
			data: {
				email,
				username,
			},
		});
		return user;
	} catch (error) {
		console.error('Error updating user settings:', error);
		throw error;
	}
}

export async function getUserInfo(username: string) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				username,
			},
			select: {
				username: true,
				image: true,
			},
		});
		return user;
	} catch (error) {
		console.error('Error fetching user info:', error);
		throw error;
	}
}

export async function avatarUpload({
	image,
}: {
	image: { type: string; data: string };
}) {
	const authenticatedUser = await getAuthenticatedUser();
	try {
		const strippedImage = image.data.replace(/^data:image\/[a-z]+;base64,/, '');
		const imageBuffer = Buffer.from(strippedImage, 'base64');
		const imageUrl = await uploadImageToS3(imageBuffer, image.type, 'avatars');

		const user = await prisma.user.update({
			where: {
				id: authenticatedUser.id,
			},
			data: {
				image: imageUrl,
			},
		});
		return user;
	} catch (error) {
		console.error('Error uploading avatar:', error);
		throw error;
	}
}

export async function requestPasswordReset(email: string) {
	const { isValid: isEmailValid, emailErrorMsg } = emailValidation(email);

	if (!isEmailValid) {
		throw new Error(emailErrorMsg);
	}

	try {
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return { success: true };
		}

		await prisma.passwordResetToken.deleteMany({
			where: { userId: user.id },
		});

		const token = uuidv4();
		const expires = new Date(Date.now() + 3600000);

		await prisma.passwordResetToken.create({
			data: {
				userId: user.id,
				token,
				expires,
			},
		});

		const headersList = headers();
		const host = headersList.get('host');
		const protocol = headersList.get('x-forwarded-proto') || 'http';
		const resetUrl = `${protocol}://${host}/reset-password?token=${token}`;

		const htmlContent = `
			<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
				<h2 style="color: #4d90fe;">Pizza Quest</h2>
				<p>You requested to reset your password.</p>
				<p>Click the button below to set a new password:</p>
				<a href="${resetUrl}"
					style="display: inline-block; background-color: #4d90fe; color: white;
					padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
					Reset Password
				</a>
				<p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
				<p style="color: #666; font-size: 14px;">
					If you didn't request this, you can safely ignore this email.
				</p>
			</div>
		`;

		await transporter.sendMail({
			from: `Pizza Quest <${process.env.GMAIL_USER}>`,
			to: email,
			subject: 'Reset your Pizza Quest password',
			html: htmlContent,
		});

		return { success: true };
	} catch (error) {
		console.error('Error requesting password reset:', error);
		throw new Error('Failed to request password reset');
	}
}

export async function validateResetToken(token: string) {
	try {
		const resetToken = await prisma.passwordResetToken.findUnique({
			where: { token },
			include: { user: true },
		});

		if (!resetToken) {
			return { valid: false, message: 'Invalid or expired reset token' };
		}

		if (resetToken.expires < new Date()) {
			await prisma.passwordResetToken.delete({
				where: { token },
			});
			return { valid: false, message: 'Reset token has expired' };
		}

		return {
			valid: true,
			email: resetToken.user.email,
		};
	} catch (error) {
		console.error('Error validating reset token:', error);
		return { valid: false, message: 'Invalid reset token' };
	}
}

export async function resetPassword(
	token: string,
	password: string,
	confirmPassword: string,
) {
	const { isValid: isPasswordValid, passwordErrorMsg } = passwordValidation(
		password,
		confirmPassword,
	);

	if (!isPasswordValid) {
		throw new Error(passwordErrorMsg);
	}

	try {
		const resetToken = await prisma.passwordResetToken.findUnique({
			where: { token },
		});

		if (!resetToken) {
			throw new Error('Invalid or expired reset token');
		}

		if (resetToken.expires < new Date()) {
			await prisma.passwordResetToken.delete({
				where: { token },
			});
			throw new Error('Reset token has expired');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await prisma.user.update({
			where: { id: resetToken.userId },
			data: { password: hashedPassword },
		});

		await prisma.passwordResetToken.delete({
			where: { token },
		});

		return { success: true };
	} catch (error) {
		console.error('Error resetting password:', error);
		throw error;
	}
}
