import '@/styles/pages/dashboard.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PizzaRatingDisplay from './PizzaRatingDisplay';

interface HighlightCardsProps {
	topRated: { name: string; rating: number } | null;
	mostPopularPlace: {
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
					<div className="flex items-center gap-2 mb-3">
						<FontAwesomeIcon
							icon="trophy"
							className="icon-color--yellow"
						/>
						<span className="text-xs uppercase tracking-wider highlight-label">
							Your Top Rated
						</span>
					</div>
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
					<div className="flex items-center gap-2 mb-3">
						<FontAwesomeIcon
							icon="fire"
							className="icon-color--orange"
						/>
						<span className="text-xs uppercase tracking-wider highlight-label">
							Most Popular
						</span>
					</div>
					<p className="font-semibold mb-1">
						{mostPopularPlace.name}
					</p>
					<div className="flex items-center gap-3">
						<PizzaRatingDisplay
							rating={mostPopularPlace.avgRating}
						/>
						<span className="text-xs highlight-sub-text">
							({mostPopularPlace.ratingCount}{' '}
							{mostPopularPlace.ratingCount === 1
								? 'rating'
								: 'ratings'}
							)
						</span>
					</div>
				</button>
			)}
		</div>
	);
}
