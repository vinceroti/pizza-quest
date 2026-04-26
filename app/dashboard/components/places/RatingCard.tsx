import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

import PizzaRatingDisplay from '../shared/PizzaRatingDisplay';
import type { PizzaSliceRating } from './Places';
import SourceFormatBadges from './SourceFormatBadges';

interface RatingCardProps {
	rating: PizzaSliceRating;
	onOpenRating: (rating: PizzaSliceRating) => void;
	onOpenImage: (imageUrl: string) => void;
}

export default function RatingCard({
	rating,
	onOpenRating,
	onOpenImage,
}: RatingCardProps) {
	return (
		<div className="rating-card">
			<div className="rating-card__head">
				{rating.user.image ? (
					<Image
						className="rounded-full"
						src={rating.user.image}
						alt=""
						width={28}
						height={28}
					/>
				) : (
					<FontAwesomeIcon
						icon="user-circle"
						className="text-gray-500"
						size="lg"
					/>
				)}
				<div className="rating-card__head-text">
					<span className="rating-card__user">{rating.user.username}</span>
					<span className="rating-card__time">
						{formatDistanceToNow(new Date(rating.createdAt))} ago
					</span>
				</div>
			</div>

			<div className="rating-card__body">
				{rating.image && (
					<button
						type="button"
						onClick={() => onOpenImage(rating.image!)}
						className="rating-card__image-btn"
						aria-label="View full image"
					>
						<Image
							src={rating.image}
							alt="Pizza"
							width={88}
							height={88}
							className="rating-card__image"
						/>
					</button>
				)}
				<button
					type="button"
					onClick={() => onOpenRating(rating)}
					className="rating-card__rating-btn"
					aria-label={`View detailed rating by ${rating.user.username}`}
				>
					<PizzaRatingDisplay rating={rating.overall} />
					<span className="rating-card__rating-hint">Tap for breakdown</span>
				</button>
			</div>

			<SourceFormatBadges source={rating.source} format={rating.format} />

			{rating.notes && <p className="rating-card__notes">{rating.notes}</p>}
		</div>
	);
}
