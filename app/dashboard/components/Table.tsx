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
} from '@mui/material';
import { Prisma } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

import { getAllPizzaPlacesWithRatings } from '@/app/actions';

import SearchBox from './SearchBox';

// Extract the type of PizzaPlace from feed
type PizzaPlace = Prisma.PromiseReturnType<
	typeof getAllPizzaPlacesWithRatings
>['pizzaPlaces'];

type PizzaSliceRating = PizzaPlace[number]['pizzaSliceRatings'][number];

export default function PizzaTable() {
	const { data: session } = useSession();
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');
	const [feed, setFeed] = useState<PizzaPlace | []>([]);
	const [ratings, setRatings] = useState<{ [key: string]: number }>({});
	const [open, setOpen] = useState<{ [key: string]: boolean }>({});
	const [openModal, setOpenModal] = useState(false);
	const [selectedRating, setSelectedRating] = useState<{
		place: PizzaPlace[number];
		rating: PizzaSliceRating;
	} | null>(null);
	const [filter, setFilter] = useState<'all' | 'self'>('self');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [sortField, setSortField] = useState<'name' | 'rating'>('rating');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

	async function getFeed() {
		try {
			setLoading(true);
			const response = await getAllPizzaPlacesWithRatings();
			setFeed(response.pizzaPlaces);
			setRatings(response.averageRatings);
		} catch (error: unknown) {
			setErrorMessage((error as Error).message);
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

	const handleOpenModal = (
		rating: PizzaSliceRating,
		place: PizzaPlace[number],
	) => {
		setSelectedRating({ rating, place });
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setSelectedRating(null);
	};

	const handleSort = (field: 'name' | 'rating') => {
		if (sortField === field) {
			// Toggle direction if same field
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			// Set new field with default descending
			setSortField(field);
			setSortDirection(field === 'rating' ? 'desc' : 'asc');
		}
	};

	// Filter and sort the feed based on the selected filter, search query, and sort settings
	const filteredFeed = feed
		.filter((place) => {
			// Filter by self if needed
			if (filter === 'self' && session) {
				return place.pizzaSliceRatings.some(
					(rating) => rating.userId === session.user.id,
				);
			}
			return true;
		})
		.filter((place) => {
			// Filter by search query
			if (!searchQuery.trim()) return true;
			const query = searchQuery.toLowerCase();
			return (
				place.mainText.toLowerCase().includes(query) ||
				place.description?.toLowerCase().includes(query)
			);
		})
		.sort((a, b) => {
			if (sortField === 'name') {
				// Sort by name
				const comparison = a.mainText.localeCompare(b.mainText);
				return sortDirection === 'asc' ? comparison : -comparison;
			} else {
				// Sort by rating
				const ratingA = ratings[a.id] || 0;
				const ratingB = ratings[b.id] || 0;
				const comparison = ratingA - ratingB;
				return sortDirection === 'asc' ? comparison : -comparison;
			}
		});

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
			<div className="flex flex-col items-center gap-4 mb-4">
				<div className="text-center flex gap-2">
					<button
						className={`button-link ${filter === 'self' ? 'opacity-50 cursor-not-allowed' : ''}`}
						onClick={() => setFilter('self')}
						disabled={filter === 'self'}
					>
						Self
					</button>
					<button
						className={`button-link ${filter === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
						onClick={() => setFilter('all')}
						disabled={filter === 'all'}
					>
						All
					</button>
				</div>
			</div>
			<SearchBox value={searchQuery} onChange={setSearchQuery} />
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
									<button
										onClick={() => handleSort('name')}
										className="flex items-center gap-2 hover:text-yellow-500 transition-colors cursor-pointer"
									>
										<FontAwesomeIcon
											icon="pizza-slice"
											className="text-yellow-500"
										/>{' '}
										Pizza Place
										{sortField === 'name' && (
											<FontAwesomeIcon
												icon={
													sortDirection === 'asc'
														? 'chevron-up'
														: 'chevron-down'
												}
											/>
										)}
									</button>
								</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>
									<button
										onClick={() => handleSort('rating')}
										className="flex items-center gap-2 hover:text-yellow-500 transition-colors cursor-pointer"
									>
										<FontAwesomeIcon icon="star" className="text-yellow-500" />{' '}
										Average Ratings
										{sortField === 'rating' && (
											<FontAwesomeIcon
												icon={
													sortDirection === 'asc'
														? 'chevron-up'
														: 'chevron-down'
												}
											/>
										)}
									</button>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredFeed.length === 0 ? (
								<TableRow>
									<TableCell colSpan={3} className="text-center">
										No pizza places to show.
									</TableCell>
								</TableRow>
							) : (
								filteredFeed.map((place) => (
									<React.Fragment key={place.id}>
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
														icon={
															open[place.id] ? 'chevron-up' : 'chevron-down'
														}
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
																			{rating.user.image ? (
																				<Image
																					className="rounded-full"
																					src={rating.user.image}
																					alt="User image"
																					width={17.5}
																					height={17.5}
																				/>
																			) : (
																				<FontAwesomeIcon
																					icon="user-circle"
																					className="text-gray-500"
																					size="lg"
																				/>
																			)}
																			<span className="ml-2">
																				{rating.user.username}
																			</span>
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
																			className="mt-4 mb-4"
																			src={rating.image || ''}
																			alt="Pizza image"
																			width={50}
																			height={50}
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
									</React.Fragment>
								))
							)}
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
						bgcolor: 'rgba(30, 58, 95, 0.95)',
						backdropFilter: 'blur(10px)',
						border: '1px solid rgba(77, 144, 254, 0.2)',
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
