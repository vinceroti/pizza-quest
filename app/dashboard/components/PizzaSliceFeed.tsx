'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { PizzaSliceRating } from '@prisma/client';
import { useEffect, useState } from 'react';

import { getAllPizzaSliceData } from '@/app/actions';

export default function PizzaSliceFeed() {
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');
	const [feed, setFeed] = useState<PizzaSliceRating[]>([]);

	async function getFeed() {
		try {
			const sliceResponse = await getAllPizzaSliceData();
			if (sliceResponse?.error) {
				setErrorMessage(sliceResponse.error);
				return;
			}
			setFeed(sliceResponse);
		} catch (error) {
			setErrorMessage(error.message);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		getFeed();
	}, []);

	return (
		<div className="mt-4 space-y-4">
			{loading ? (
				<FontAwesomeIcon
					icon="circle-notch"
					className="animate-spin mt-44 mx-auto"
					size="3x"
				/>
			) : errorMessage ? (
				<div className="text-center">{errorMessage}</div>
			) : (
				<div>
					<h3 className="text-center">Welcome to the Pizza Sphere</h3>
					<div className="flex flex-wrap justify-center mt-10">
						{feed.map((slice) => (
							<Card
								sx={{
									width: { xs: '100%', sm: '48%' },
									padding: '8px',
									marginBottom: '8px',
								}}
								key={slice.id}
								className="max-w-md mx-auto bg-white shadow-md overflow-hidden md:max-w-2xl"
							>
								<CardMedia
									component="img"
									height="194"
									image={slice.image}
									alt="Pizza image"
								/>
								<CardContent>
									<h5>{slice.pizzaPlace.mainText}</h5>
									<div>
										Overall: {slice.overall}
										<br />
										Crust/Dough: {slice.crustDough}
										<br />
										Sauce: {slice.sauce}
										<br />
										Topping to Pizza Ratio: {slice.toppingToPizzaRatio}
										<br />
										Creativity: {slice.creativity}
										<br />
										Authenticity: {slice.authenticity}
										<br />
										Notes: {slice.notes}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
