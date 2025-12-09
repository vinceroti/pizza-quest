'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	Collapse,
	IconButton,
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

import FilterTabs from './FilterTabs';
import ImageModal from './ImageModal';
import LoadingSpinner from './LoadingSpinner';
import PizzaRatingDisplay from './PizzaRatingDisplay';
import RatingDetailModal from './RatingDetailModal';
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
	const [openImageModal, setOpenImageModal] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

	const handleOpenImageModal = (imageUrl: string) => {
		setSelectedImage(imageUrl);
		setOpenImageModal(true);
	};

	const handleCloseImageModal = () => {
		setOpenImageModal(false);
		setSelectedImage(null);
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

	return (
		<div
			className="mt-4 space-y-4"
			style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
		>
			<div className="flex flex-col items-center gap-4 mb-4">
				<FilterTabs activeFilter={filter} onFilterChange={setFilter} />
			</div>
			<SearchBox value={searchQuery} onChange={setSearchQuery} />
			<div style={{ minHeight: '400px' }}>
				{loading ? (
					<LoadingSpinner />
				) : errorMessage ? (
					<div className="text-center">{errorMessage}</div>
				) : (
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell
										style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
									>
										<button
											onClick={() => handleSort('name')}
											className="flex items-center gap-2 hover:text-yellow-500 transition-colors cursor-pointer"
										>
											<Image
												src="/pizza-slice-single.webp"
												alt="Pizza slice"
												width={16}
												height={16}
												className="inline-block"
												style={{ objectFit: 'contain' }}
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
									<TableCell
										style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
									>
										Location
									</TableCell>
									<TableCell
										style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
									>
										<button
											onClick={() => handleSort('rating')}
											className="flex items-center gap-2 hover:text-yellow-500 transition-colors cursor-pointer"
										>
											<FontAwesomeIcon
												icon="star"
												className="text-yellow-500"
											/>{' '}
											Ratings
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
												<TableCell
													style={{
														paddingTop: '0.75rem',
														paddingBottom: '0.75rem',
													}}
												>
													<div className="flex items-center gap-2">
														<IconButton
															aria-label="expand row"
															size="small"
															onClick={() => handleToggle(place.id)}
														>
															<FontAwesomeIcon
																size="xs"
																icon={open[place.id] ? 'minus' : 'plus'}
															/>
														</IconButton>
														<span>{place.mainText}</span>
													</div>
												</TableCell>
												<TableCell
													style={{
														paddingTop: '0.75rem',
														paddingBottom: '0.75rem',
													}}
												>
													{' '}
													{place.description}
												</TableCell>
												<TableCell
													style={{
														paddingTop: '0.75rem',
														paddingBottom: '0.75rem',
													}}
												>
													<div className="flex items-center gap-2">
														<FontAwesomeIcon
															icon="star"
															size="lg"
															className="text-yellow-500"
														/>
														<span>{ratings[place.id] || 0}</span>
													</div>
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell
													style={{
														padding: 0,
													}}
													colSpan={6}
												>
													<Collapse
														in={open[place.id]}
														timeout="auto"
														unmountOnExit
													>
														<Table
															size="small"
															aria-label="pizzas"
															style={{
																backgroundColor: 'rgba(15, 30, 50, 0.6)',
																backdropFilter: 'blur(10px)',
																border: '1px solid rgba(77, 144, 254, 0.2)',
															}}
														>
															<TableHead>
																<TableRow>
																	<TableCell style={{ paddingLeft: '2rem' }}>
																		User
																	</TableCell>
																	<TableCell>Time Ago</TableCell>
																	<TableCell>Image</TableCell>
																	<TableCell>Rating</TableCell>
																	<TableCell>Notes</TableCell>
																</TableRow>
															</TableHead>
															<TableBody>
																{place.pizzaSliceRatings.map((rating) => (
																	<TableRow key={rating.id}>
																		<TableCell
																			style={{
																				paddingLeft: '2rem',
																				paddingTop: '1rem',
																				paddingBottom: '1rem',
																			}}
																		>
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
																			{rating.image && (
																				<button
																					onClick={() => {
																						const img = rating.image!;
																						handleOpenImageModal(img);
																					}}
																					className="cursor-pointer hover:opacity-80 transition-opacity"
																					aria-label="View full image"
																				>
																					<Image
																						src={rating.image}
																						alt="Pizza image"
																						width={50}
																						height={50}
																					/>
																				</button>
																			)}
																		</TableCell>
																		<TableCell>
																			<IconButton
																				onClick={() =>
																					handleOpenModal(rating, place)
																				}
																				aria-label="rating"
																				size="small"
																			>
																				<PizzaRatingDisplay
																					rating={rating.overall}
																					className="mt-2"
																				/>
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
			</div>
			<RatingDetailModal
				open={openModal}
				onClose={handleCloseModal}
				username={selectedRating?.rating.user.username}
				placeName={selectedRating?.place.mainText}
				rating={selectedRating?.rating}
			/>
			<ImageModal
				open={openImageModal}
				onClose={handleCloseImageModal}
				imageUrl={selectedImage}
			/>
		</div>
	);
}
