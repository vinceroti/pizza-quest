import { PrismaClient } from '@prisma/client';

import { PizzaDescriptors, PizzaItems } from '@/config/enums/PizzaItems';

const prisma = new PrismaClient();

function createPizzaUsername(): string {
	const pizzaItems = Object.values(PizzaItems) as string[];
	const pizzaDescriptors = Object.values(PizzaDescriptors) as string[];
	const descriptor =
		pizzaDescriptors[Math.floor(Math.random() * pizzaDescriptors.length)];
	const pizzaItem = pizzaItems[Math.floor(Math.random() * pizzaItems.length)];
	const randomNumber = Math.floor(Math.random() * 10000);
	return `${descriptor}${pizzaItem}${randomNumber}`;
}

async function generatePizzaUsername(): Promise<string> {
	let isUnique = false;
	let username = '';
	while (!isUnique) {
		username = createPizzaUsername();
		const userExists = await prisma.user.findUnique({
			where: {
				username,
			},
		});
		if (!userExists) {
			isUnique = true;
		}
	}
	return username;
}

function passwordValidation(password: string, confirmPassword: string) {
	let isValid = true;
	let passwordErrorMsg = '';
	let confirmPasswordErrorMsg = '';

	if (password.length < 8) {
		passwordErrorMsg = 'Password must be at least 8 characters long.';
	}

	if (!/[A-Z]/.test(password)) {
		passwordErrorMsg += ' Password must contain at least one uppercase letter.';
	}

	if (!/[a-z]/.test(password)) {
		passwordErrorMsg += ' Password must contain at least one lowercase letter.';
	}

	if (!/[0-9]/.test(password)) {
		passwordErrorMsg += ' Password must contain at least one digit.';
	}

	if (!/[^A-Za-z0-9]/.test(password)) {
		passwordErrorMsg += 'Password must contain at least one special character.';
	}

	if (password !== confirmPassword) {
		confirmPasswordErrorMsg = 'Passwords do not match.';
	}

	if (passwordErrorMsg || confirmPasswordErrorMsg) {
		isValid = false;
	}

	return {
		isValid,
		passwordErrorMsg,
		confirmPasswordErrorMsg,
	};
}

export { generatePizzaUsername, passwordValidation };
