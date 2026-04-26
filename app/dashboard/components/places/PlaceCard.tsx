import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import type { PizzaPlace } from './Places';

interface PlaceCardProps {
	place: PizzaPlace;
	rating: number;
	showYoursBadge: boolean;
}

export default function PlaceCard({
	place,
	rating,
	showYoursBadge,
}: PlaceCardProps) {
	const ratingCount = place.pizzaSliceRatings.length;

	return (
		<article
			data-place-id={place.id}
			className="place-card glass-card rounded-xl"
		>
			<Link
				href={`/dashboard/places/${place.id}`}
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
					<FontAwesomeIcon icon="chevron-right" />
				</span>
			</Link>
		</article>
	);
}
