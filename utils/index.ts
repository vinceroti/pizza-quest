import prisma from '@/app/lib/prisma';
import { PizzaDescriptors, PizzaItems } from '@/config/enums/PizzaItems';

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

export { generatePizzaUsername };
