import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse } from '@mui/material';

import type { PizzaPlace, PizzaSliceRating } from './Places';
import RatingCard from './RatingCard';

interface PlaceCardProps {
	place: PizzaPlace;
	rating: number;
	isOpen: boolean;
	showYoursBadge: boolean;
	onToggle: (id: string) => void;
	onOpenRating: (rating: PizzaSliceRating, place: PizzaPlace) => void;
	onOpenImage: (imageUrl: string) => void;
}

export default function PlaceCard({
	place,
	rating,
	isOpen,
	showYoursBadge,
	onToggle,
	onOpenRating,
	onOpenImage,
}: PlaceCardProps) {
	const ratingCount = place.pizzaSliceRatings.length;

	return (
		<article
			data-place-id={place.id}
			className="place-card glass-card rounded-xl"
		>
			<button
				type="button"
				onClick={() => onToggle(place.id)}
				aria-expanded={isOpen}
				aria-controls={`place-${place.id}-details`}
				className="place-card__header"
			>
				<div className="place-card__main">
					<h6 className="place-card__name">{place.mainText}</h6>
					{place.description && (
						<p className="place-card__location">{place.description}</p>
					)}
					<div className="place-card__meta">
						<span className="place-card__rating">
							<FontAwesomeIcon icon="star" className="text-yellow-500" />
							<span>{rating || '—'}</span>
							<span className="place-card__rating-count">
								· {ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'}
							</span>
						</span>
						{showYoursBadge && (
							<span className="badge badge--gold">
								<FontAwesomeIcon icon="check" />
								Yours
							</span>
						)}
					</div>
				</div>
				<span className="place-card__chevron" aria-hidden="true">
					<FontAwesomeIcon icon={isOpen ? 'chevron-up' : 'chevron-down'} />
				</span>
			</button>

			<Collapse in={isOpen} timeout="auto" unmountOnExit>
				<div
					id={`place-${place.id}-details`}
					className="place-card__details"
				>
					<ul className="space-y-3 m-0 p-0 list-none">
						{place.pizzaSliceRatings.map((sliceRating) => (
							<li key={sliceRating.id}>
								<RatingCard
									rating={sliceRating}
									onOpenRating={(r) => onOpenRating(r, place)}
									onOpenImage={onOpenImage}
								/>
							</li>
						))}
					</ul>
				</div>
			</Collapse>
		</article>
	);
}
