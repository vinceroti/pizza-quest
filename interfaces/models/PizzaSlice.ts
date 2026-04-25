import { PizzaFormat, PizzaSource } from '@prisma/client';

import GooglePrediction from './GooglePrediction';

export interface PizzaSlice {
	pizzaPlace: GooglePrediction | null;
	customPlaceName?: string;
	source: PizzaSource;
	format: PizzaFormat;
	overall: number;
	crustDough: number;
	sauce: number;
	toppingToPizzaRatio: number;
	creativity: number;
	authenticity: number;
	notes?: string;
	image: { type: string; data: string };
	userId: number;
}
