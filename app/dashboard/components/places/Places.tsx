'use client';

import { Prisma } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';

import { getAllPizzaPlacesWithRatings } from '@/app/actions';

import ImageModal from './ImageModal';
import PlaceList from './PlaceList';
import PlaceListControls, {
	type SortDirection,
	type SortField,
} from './PlaceListControls';
import RatingDetailModal from './RatingDetailModal';

export type PizzaPlaceData = Prisma.PromiseReturnType<
	typeof getAllPizzaPlacesWithRatings
>;

export type PizzaPlace = PizzaPlaceData['pizzaPlaces'][number];
export type PizzaSliceRating = PizzaPlace['pizzaSliceRatings'][number];

interface PlacesProps {
	initialData: PizzaPlaceData;
	filter: 'all' | 'self';
	focusedPlaceId?: string | null;
	userRatedPlaceIds: string[];
}

interface FilterAndSortOptions {
	places: PizzaPlace[];
	ratings: Record<string, number>;
	filter: 'all' | 'self';
	userRatedPlaceIds: string[];
	searchQuery: string;
	sortField: SortField;
	sortDirection: SortDirection;
}

function filterAndSortPlaces({
	places,
	ratings,
	filter,
	userRatedPlaceIds,
	searchQuery,
	sortField,
	sortDirection,
}: FilterAndSortOptions): PizzaPlace[] {
	const query = searchQuery.trim().toLowerCase();

	return places
		.filter((place) =>
			filter === 'self'
				? userRatedPlaceIds.includes(place.id)
				: place.source !== 'HOMEMADE',
		)
		.filter((place) => {
			if (!query) return true;
			return (
				place.mainText.toLowerCase().includes(query) ||
				place.description?.toLowerCase().includes(query)
			);
		})
		.sort((a, b) => {
			const direction = sortDirection === 'asc' ? 1 : -1;
			if (sortField === 'name') {
				return a.mainText.localeCompare(b.mainText) * direction;
			}
			const ratingA = ratings[a.id] || 0;
			const ratingB = ratings[b.id] || 0;
			return (ratingA - ratingB) * direction;
		});
}

export default function Places({
	initialData,
	filter,
	focusedPlaceId,
	userRatedPlaceIds,
}: PlacesProps) {
	const [feed] = useState<PizzaPlace[]>(initialData.pizzaPlaces);
	const [ratings] = useState<Record<string, number>>(initialData.averageRatings);
	const [open, setOpen] = useState<Record<string, boolean>>(
		focusedPlaceId ? { [focusedPlaceId]: true } : {},
	);
	const rootRef = useRef<HTMLDivElement>(null);

	const [openModal, setOpenModal] = useState(false);
	const [openImageModal, setOpenImageModal] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [selectedRating, setSelectedRating] = useState<{
		place: PizzaPlace;
		rating: PizzaSliceRating;
	} | null>(null);

	const [searchQuery, setSearchQuery] = useState<string>('');
	const [sortField, setSortField] = useState<SortField>('rating');
	const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

	useEffect(() => {
		if (!focusedPlaceId || !rootRef.current) return;
		setOpen((prev) => ({ ...prev, [focusedPlaceId]: true }));
		const card = rootRef.current.querySelector<HTMLElement>(
			`[data-place-id="${CSS.escape(focusedPlaceId)}"]`,
		);
		if (card) {
			card.scrollIntoView({ behavior: 'smooth', block: 'center' });
			card.classList.add('place-list__card--focus-flash');
			const timeout = window.setTimeout(() => {
				card.classList.remove('place-list__card--focus-flash');
			}, 1600);
			return () => window.clearTimeout(timeout);
		}
	}, [focusedPlaceId]);

	const handleToggle = (id: string) => {
		setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const handleOpenModal = (rating: PizzaSliceRating, place: PizzaPlace) => {
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

	const handleSortChange = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDirection(field === 'rating' ? 'desc' : 'asc');
		}
	};

	const filteredPlaces = filterAndSortPlaces({
		places: feed,
		ratings,
		filter,
		userRatedPlaceIds,
		searchQuery,
		sortField,
		sortDirection,
	});

	return (
		<div className="space-y-4 place-list" ref={rootRef}>
			<PlaceListControls
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				sortField={sortField}
				sortDirection={sortDirection}
				onSortChange={handleSortChange}
			/>

			<PlaceList
				places={filteredPlaces}
				ratings={ratings}
				open={open}
				onToggle={handleToggle}
				onOpenRating={handleOpenModal}
				onOpenImage={handleOpenImageModal}
				filter={filter}
				userRatedPlaceIds={userRatedPlaceIds}
				searchQuery={searchQuery}
			/>

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
