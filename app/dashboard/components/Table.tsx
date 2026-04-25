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
import React, { useState } from 'react';

import { getAllPizzaPlacesWithRatings } from '@/app/actions';

import EmptyState from './EmptyState';
import ImageModal from './ImageModal';
import PizzaRatingDisplay from './PizzaRatingDisplay';
import RatingDetailModal from './RatingDetailModal';
import SearchBox from './SearchBox';

export type PizzaPlaceData = Prisma.PromiseReturnType<
	typeof getAllPizzaPlacesWithRatings
>;

type PizzaPlace = PizzaPlaceData['pizzaPlaces'];
type PizzaSliceRating = PizzaPlace[number]['pizzaSliceRatings'][number];

interface PizzaTableProps {
	initialData: PizzaPlaceData;
	filter: 'all' | 'self';
}

export default function PizzaTable({ initialData, filter }: PizzaTableProps) {
	const { data: session } = useSession();
	const [feed] = useState<PizzaPlace>(initialData.pizzaPlaces);
	const [ratings] = useState<{ [key: string]: number }>(
		initialData.averageRatings,
	);
	const [open, setOpen] = useState<{ [key: string]: boolean }>({});
	const [openModal, setOpenModal] = useState(false);
	const [openImageModal, setOpenImageModal] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [selectedRating, setSelectedRating] = useState<{
		place: PizzaPlace[number];
		rating: PizzaSliceRating;
	} | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [sortField, setSortField] = useState<'name' | 'rating'>('rating');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDirection(field === 'rating' ? 'desc' : 'asc');
		}
	};

	const filteredFeed = feed
		.filter((place) => {
			if (filter === 'self' && session) {
				return place.pizzaSliceRatings.some(
					(rating) => rating.userId === session.user.id,
				);
			}
			return true;
		})
		.filter((place) => {
			if (!searchQuery.trim()) return true;
			const query = searchQuery.toLowerCase();
			return (
				place.mainText.toLowerCase().includes(query) ||
				place.description?.toLowerCase().includes(query)
			);
		})
		.sort((a, b) => {
			if (sortField === 'name') {
				const comparison = a.mainText.localeCompare(b.mainText);
				return sortDirection === 'asc' ? comparison : -comparison;
			} else {
				const ratingA = ratings[a.id] || 0;
				const ratingB = ratings[b.id] || 0;
				const comparison = ratingA - ratingB;
				return sortDirection === 'asc' ? comparison : -comparison;
			}
		});

	return (
		<div className="space-y-4 pizza-table">
			<SearchBox value={searchQuery} onChange={setSearchQuery} />
			<TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell className="pizza-table__cell">
								<button
									onClick={() => handleSort('name')}
									className="flex items-center gap-2 hover:text-yellow-500 transition-colors cursor-pointer"
								>
									<Image
										src="/pizza-slice-single.webp"
										alt="Pizza slice"
										width={16}
										height={16}
										className="pizza-icon"
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
							<TableCell className="pizza-table__cell">
								Location
							</TableCell>
							<TableCell className="pizza-table__cell">
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
								<TableCell colSpan={3} sx={{ border: 'none' }}>
									<EmptyState
										title={searchQuery ? 'No matches' : 'No pizza places yet'}
										message={
											searchQuery
												? 'Try a different search term.'
												: 'Submit your first pizza rating to get started!'
										}
									/>
								</TableCell>
							</TableRow>
						) : (
							filteredFeed.map((place) => (
								<React.Fragment key={place.id}>
									<TableRow key={place.id}>
										<TableCell className="pizza-table__cell">
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
										<TableCell className="pizza-table__cell">
											{place.description}
										</TableCell>
										<TableCell className="pizza-table__cell">
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
										<TableCell className="pizza-table__cell--collapsed" colSpan={6}>
											<Collapse
												in={open[place.id]}
												timeout="auto"
												unmountOnExit
											>
												<Table
													size="small"
													aria-label="pizzas"
													className="pizza-table__expanded-inner"
												>
													<TableHead>
														<TableRow>
															<TableCell className="pizza-table__cell--header-user">
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
																<TableCell className="pizza-table__cell--user">
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
																		aria-label={[
																			'View detailed rating by',
																			rating.user.username,
																		].join(' ')}
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
