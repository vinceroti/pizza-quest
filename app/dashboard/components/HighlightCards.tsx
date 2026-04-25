import '@/styles/pages/dashboard.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PizzaRatingDisplay from './PizzaRatingDisplay';

interface HighlightCardsProps {
	topRated: { placeId: string; name: string; rating: number } | null;
	mostPopularPlace: {
		placeId: string;
		name: string;
		avgRating: number;
		ratingCount: number;
	} | null;
	onTopRatedClick?: () => void;
	onMostPopularClick?: () => void;
}

export default function HighlightCards({
	topRated,
	mostPopularPlace,
	onTopRatedClick,
	onMostPopularClick,
}: HighlightCardsProps) {
	if (!topRated && !mostPopularPlace) return null;

	return (
		<div className="grid gap-4 mb-8 highlights-grid">
			{topRated && (
				<button
					type="button"
					onClick={onTopRatedClick}
					className="glass-card--gold glass-card--interactive p-5 rounded-xl text-left"
				>
					<span className="badge badge--gold mb-3">
						<FontAwesomeIcon icon="trophy" />
						Your Top Rated
					</span>
					<p className="font-semibold mb-1">{topRated.name}</p>
					<PizzaRatingDisplay rating={topRated.rating} />
				</button>
			)}
			{mostPopularPlace && (
				<button
					type="button"
					onClick={onMostPopularClick}
					className="glass-card--blue glass-card--interactive p-5 rounded-xl text-left"
				>
					<span className="badge badge--blue mb-3">
						<FontAwesomeIcon icon="fire" />
						Most Popular
					</span>
					<p className="font-semibold mb-1">
						{mostPopularPlace.name}
					</p>
					<div className="flex flex-wrap items-center gap-2">
						<PizzaRatingDisplay
							rating={mostPopularPlace.avgRating}
						/>
						<span className="badge badge--ghost">
							<FontAwesomeIcon icon="chart-bar" />
							{mostPopularPlace.ratingCount}{' '}
							{mostPopularPlace.ratingCount === 1
								? 'rating'
								: 'ratings'}
						</span>
					</div>
				</button>
			)}
		</div>
	);
}
