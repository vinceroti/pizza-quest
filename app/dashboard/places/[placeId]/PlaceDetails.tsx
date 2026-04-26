'use client';

import '@/styles/pages/dashboard.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Prisma } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';

import type { getPizzaPlaceDetails } from '@/app/actions';

import ImageModal from '../../components/places/ImageModal';
import RatingCard from '../../components/places/RatingCard';
import RatingDetailModal from '../../components/places/RatingDetailModal';
import PizzaRatingDisplay from '../../components/shared/PizzaRatingDisplay';

type PizzaPlaceDetails = NonNullable<
	Prisma.PromiseReturnType<typeof getPizzaPlaceDetails>
>;

interface PlaceDetailsProps {
	details: PizzaPlaceDetails;
}

export default function PlaceDetails({ details }: PlaceDetailsProps) {
	const [openModal, setOpenModal] = useState(false);
	const [openImageModal, setOpenImageModal] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [selectedRating, setSelectedRating] = useState<
		PizzaPlaceDetails['pizzaPlace']['pizzaSliceRatings'][number] | null
	>(null);

	const { pizzaPlace, averageRating, yourRatings, communityRatings, userHasRated } =
		details;

	const handleOpenModal = (
		rating: PizzaPlaceDetails['pizzaPlace']['pizzaSliceRatings'][number],
	) => {
		setSelectedRating(rating);
		setOpenModal(true);
	};

	return (
		<div className="w-full max-width place-details">
			<div className="mb-6">
				<Link href="/dashboard" className="place-details__back-link">
					<FontAwesomeIcon icon="arrow-left" />
					Back to dashboard
				</Link>
			</div>

			<section className="glass-card rounded-xl p-6 mb-8">
				<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
					<div>
						<p className="badge badge--blue mb-3">
							<FontAwesomeIcon
								icon={pizzaPlace.source === 'HOMEMADE' ? 'house' : 'store'}
							/>
							{pizzaPlace.source === 'HOMEMADE' ? 'Homemade' : 'Pizza Place'}
						</p>
						<h3 className="mb-2">{pizzaPlace.mainText}</h3>
						{pizzaPlace.description && (
							<p className="place-details__description">{pizzaPlace.description}</p>
						)}
					</div>

					<div className="place-details__summary">
						<div className="place-details__summary-rating">
							<span className="place-details__summary-label">Average</span>
							<PizzaRatingDisplay rating={averageRating} />
						</div>
						<div className="place-details__summary-count">
							{pizzaPlace.pizzaSliceRatings.length}{' '}
							{pizzaPlace.pizzaSliceRatings.length === 1 ? 'rating' : 'ratings'}
						</div>
					</div>
				</div>
			</section>

			<section className="glass-card rounded-xl p-6 mb-8">
				<div className="place-details__section-header">
					<div>
						<h4 className="mb-1">Your Ratings</h4>
						<p className="dashboard-subtitle mb-0">
							{userHasRated
								? 'Your history for this place lives here.'
								: 'No rating from you yet.'}
						</p>
					</div>
					<Link href="/dashboard/new" className="submit-cta place-details__cta">
						<span className="submit-cta__label">Add Your Rating</span>
						<span className="submit-cta__sub">
							Start a new rating entry for this place.
						</span>
					</Link>
				</div>

				{yourRatings.length > 0 ? (
					<ul className="space-y-3 m-0 mt-5 p-0 list-none">
						{yourRatings.map((rating) => (
							<li key={rating.id}>
								<RatingCard
									rating={rating}
									onOpenRating={handleOpenModal}
									onOpenImage={(imageUrl) => {
										setSelectedImage(imageUrl);
										setOpenImageModal(true);
									}}
								/>
							</li>
						))}
					</ul>
				) : (
					<div className="place-details__empty mt-5">
						<FontAwesomeIcon icon="pizza-slice" />
						<span>You haven’t rated this one yet.</span>
					</div>
				)}
			</section>

			<section className="glass-card rounded-xl p-6">
				<div className="place-details__section-header">
					<div>
						<h4 className="mb-1">Community Ratings</h4>
						<p className="dashboard-subtitle mb-0">
							Other people’s scores, notes, and photos.
						</p>
					</div>
				</div>

				{communityRatings.length > 0 ? (
					<ul className="space-y-3 m-0 mt-5 p-0 list-none">
						{communityRatings.map((rating) => (
							<li key={rating.id}>
								<RatingCard
									rating={rating}
									onOpenRating={handleOpenModal}
									onOpenImage={(imageUrl) => {
										setSelectedImage(imageUrl);
										setOpenImageModal(true);
									}}
								/>
							</li>
						))}
					</ul>
				) : (
					<div className="place-details__empty mt-5">
						<FontAwesomeIcon icon="camera" />
						<span>No one else has rated this place yet.</span>
					</div>
				)}
			</section>

			<RatingDetailModal
				open={openModal}
				onClose={() => {
					setOpenModal(false);
					setSelectedRating(null);
				}}
				username={selectedRating?.user.username}
				placeName={pizzaPlace.mainText}
				rating={selectedRating ?? undefined}
			/>
			<ImageModal
				open={openImageModal}
				onClose={() => {
					setOpenImageModal(false);
					setSelectedImage(null);
				}}
				imageUrl={selectedImage}
			/>
		</div>
	);
}
