import EmptyState from '../shared/EmptyState';
import PlaceCard from './PlaceCard';
import type { PizzaPlace } from './Places';

interface PlaceListProps {
	places: PizzaPlace[];
	ratings: Record<string, number>;
	filter: 'all' | 'self';
	userRatedPlaceIds: string[];
	searchQuery: string;
}

export default function PlaceList({
	places,
	ratings,
	filter,
	userRatedPlaceIds,
	searchQuery,
}: PlaceListProps) {
	if (places.length === 0) {
		return (
			<EmptyState
				title={searchQuery ? "Nothin' matches" : 'The oven is empty'}
				message={
					searchQuery
						? "Couldn't find any slices like that."
						: 'Drop a rating and start the quest.'
				}
			/>
		);
	}

	return (
		<ul className="space-y-3 m-0 p-0 list-none">
			{places.map((place) => (
				<li key={place.id}>
					<PlaceCard
						place={place}
						rating={ratings[place.id] || 0}
						showYoursBadge={
							filter === 'all' && userRatedPlaceIds.includes(place.id)
						}
					/>
				</li>
			))}
		</ul>
	);
}
