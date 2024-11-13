'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	Box,
	Collapse,
	IconButton,
	Modal,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { PizzaPlace, PizzaSliceRating } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { getAllPizzaPlacesWithRatings } from '@/app/actions';

export default function PizzaSliceFeed() {
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');
	const [feed, setFeed] = useState<PizzaPlace[]>([]);
	const [ratings, setRatings] = useState<{ [key: string]: number }>({});
	const [open, setOpen] = useState<{ [key: string]: boolean }>({});
	const [openModal, setOpenModal] = useState(false);
	const [selectedRating, setSelectedRating] = useState<{
		place: PizzaPlace;
		rating: PizzaSliceRating;
	} | null>(null);

	async function getFeed() {
		try {
			setLoading(true);
			const response = await getAllPizzaPlacesWithRatings();

			if (response.pizzaPlaces?.error) {
				setErrorMessage(response.pizzaPlaces.error);
				return;
			}
			setFeed(response.pizzaPlaces);
			setRatings(response.averageRatings);
		} catch (error) {
			setErrorMessage(error.message);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		getFeed();
	}, []);

	const handleToggle = (id: string) => {
		setOpen((prevOpen) => ({
			...prevOpen,
			[id]: !prevOpen[id],
		}));
	};

	const handleOpenModal = (rating, place) => {
		setSelectedRating({ rating, place });
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setSelectedRating(null);
	};
	const renderPizzaSlices = (rating?: number) => {
		if (!rating) {
			return null;
		}
		const fullSlices = Math.floor(rating);
		const hasHalfSlice = rating % 1 !== 0;
		const emptySlices = 5 - fullSlices - (hasHalfSlice ? 1 : 0);

		return (
			<div className="flex items-center mt-2">
				{Array.from({ length: fullSlices }).map((_, index) => (
					<FontAwesomeIcon
						key={`full-${index}`}
						icon="pizza-slice"
						className="text-yellow-500"
					/>
				))}
				{hasHalfSlice && (
					<span className="relative flex">
						<FontAwesomeIcon
							key="half"
							icon="pizza-slice"
							className="text-gray-300"
						/>
						<FontAwesomeIcon
							key="half-colored"
							icon="pizza-slice"
							className="text-yellow-500 absolute top-0 left-0"
							style={{ clipPath: 'inset(0 50% 0 0)' }}
						/>
					</span>
				)}
				{Array.from({ length: emptySlices }).map((_, index) => (
					<FontAwesomeIcon
						key={`empty-${index}`}
						icon="pizza-slice"
						className="text-gray-300"
					/>
				))}
			</div>
		);
	};

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
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>
									<FontAwesomeIcon
										icon="pizza-slice"
										className="text-yellow-500"
									/>{' '}
									Pizza Place
								</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>
									<FontAwesomeIcon icon="star" className="text-yellow-500" />{' '}
									Average Ratings
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{feed.map((place) => (
								<>
									<TableRow key={place.id}>
										<TableCell>
											<FontAwesomeIcon
												icon="pizza-slice"
												className="text-yellow-500"
											/>{' '}
											{place.mainText}
										</TableCell>
										<TableCell>{place.description}</TableCell>
										<TableCell>
											<IconButton
												aria-label="expand row"
												size="small"
												className="flex gap-2"
												onClick={() => handleToggle(place.id)}
											>
												<FontAwesomeIcon
													icon="star"
													className="text-yellow-500"
												/>{' '}
												{ratings[place.id] || 0}
												<FontAwesomeIcon
													icon={open[place.id] ? 'chevron-up' : 'chevron-down'}
												/>
											</IconButton>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell
											style={{ paddingBottom: 0, paddingTop: 0 }}
											colSpan={6}
										>
											<Collapse
												in={open[place.id]}
												timeout="auto"
												unmountOnExit
											>
												<Table size="small" aria-label="pizzas">
													<TableHead>
														<TableRow>
															<TableCell>User</TableCell>
															<TableCell>Time Ago</TableCell>
															<TableCell>Image</TableCell>
															<TableCell>Rating</TableCell>
															<TableCell>Notes</TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														{place.pizzaSliceRatings.map((rating) => (
															<TableRow key={rating.id}>
																<TableCell>
																	<div className="flex items-center">
																		<FontAwesomeIcon
																			icon="user-circle"
																			className="text-gray-500 mr-2"
																			size="lg"
																		/>
																		{rating.user.username}
																	</div>
																</TableCell>
																<TableCell>
																	{formatDistanceToNow(
																		new Date(rating.createdAt),
																	)}{' '}
																	ago
																</TableCell>
																<TableCell>
																	<Image
																		src={rating.image}
																		alt="Pizza image"
																		width={50}
																		height={50}
																		className="m-4"
																	/>
																</TableCell>
																<TableCell>
																	<IconButton
																		onClick={() =>
																			handleOpenModal(rating, place)
																		}
																		aria-label="rating"
																		size="small"
																	>
																		{renderPizzaSlices(rating.overall)}
																	</IconButton>
																</TableCell>
																<TableCell>{rating.notes}</TableCell>
															</TableRow>
														))}
													</TableBody>
												</Table>
											</Collapse>
										</TableCell>
									</TableRow>
								</>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
			<Modal
				open={openModal}
				onClose={handleCloseModal}
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
			>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 600,
						bgcolor: 'background.paper',
						boxShadow: 24,
						p: 4,
						color: 'text.primary',
					}}
				>
					<h5>
						{selectedRating?.rating.user.username} Rating for{' '}
						{selectedRating?.place.mainText}
					</h5>
					<div className="grid grid-cols-2 gap-6 mt-5">
						<p>Overall: {renderPizzaSlices(selectedRating?.rating.overall)}</p>
						<p>
							Crust Dough:{' '}
							{renderPizzaSlices(selectedRating?.rating.crustDough)}
						</p>
						<p>Sauce: {renderPizzaSlices(selectedRating?.rating.sauce)}</p>
						<p>
							Topping to Pizza Ratio:{' '}
							{renderPizzaSlices(selectedRating?.rating.toppingToPizzaRatio)}
						</p>
						<p>
							Creativity: {renderPizzaSlices(selectedRating?.rating.creativity)}
						</p>
						<p>
							Authenticity:{' '}
							{renderPizzaSlices(selectedRating?.rating.authenticity)}
						</p>
					</div>
				</Box>
			</Modal>
		</div>
	);
}
