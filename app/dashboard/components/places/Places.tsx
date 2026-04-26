'use client';

import { Prisma } from '@prisma/client';
import { useState } from 'react';

import { getAllPizzaPlacesWithRatings } from '@/app/actions';

import PlaceList from './PlaceList';
import PlaceListControls, {
	type SortDirection,
	type SortField,
} from './PlaceListControls';

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
	userRatedPlaceIds,
}: PlacesProps) {
	const [feed] = useState<PizzaPlace[]>(initialData.pizzaPlaces);
	const [ratings] = useState<Record<string, number>>(initialData.averageRatings);

	const [searchQuery, setSearchQuery] = useState<string>('');
	const [sortField, setSortField] = useState<SortField>('rating');
	const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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
		<div className="space-y-4 place-list">
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
				filter={filter}
				userRatedPlaceIds={userRatedPlaceIds}
				searchQuery={searchQuery}
			/>
		</div>
	);
}
