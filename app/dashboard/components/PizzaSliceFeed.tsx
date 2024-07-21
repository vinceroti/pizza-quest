'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { PizzaSliceRating } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';

import { getAllPizzaSliceData } from '@/app/actions';

import CommentSection from './CommentSection';
import LikeSection from './LikeSection';

const renderPizzaSlices = (rating: number) => {
	const fullSlices = Math.floor(rating);
	const hasHalfSlice = rating % 1 !== 0;
	const emptySlices = 5 - fullSlices - (hasHalfSlice ? 1 : 0);

	return (
		<div className="flex items-center">
			{Array.from({ length: fullSlices }).map((_, index) => (
				<FontAwesomeIcon
					key={`full-${index}`}
					icon="pizza-slice"
					className="text-yellow-500"
				/>
			))}
			{hasHalfSlice && (
				<span className="relative flex">
					<FontAwesomeIcon
						key="half"
						icon="pizza-slice"
						className="text-gray-300"
					/>
					<FontAwesomeIcon
						key="half-colored"
						icon="pizza-slice"
						className="text-yellow-500 absolute top-0 left-0"
						style={{ clipPath: 'inset(0 50% 0 0)' }}
					/>
				</span>
			)}
			{Array.from({ length: emptySlices }).map((_, index) => (
				<FontAwesomeIcon
					key={`empty-${index}`}
					icon="pizza-slice"
					className="text-gray-300"
				/>
			))}
		</div>
	);
};

export default function PizzaSliceFeed({ userId }: { userId?: number }) {
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');
	const [feed, setFeed] = useState<PizzaSliceRating[]>([]);
	const [filter, setFilter] = useState<'all' | 'user'>('all');

	async function getFeed() {
		try {
			setLoading(true);
			let sliceResponse: PizzaSliceRating[] | undefined;

			if (filter === 'all') {
				sliceResponse = await getAllPizzaSliceData();
			} else {
				sliceResponse = await getAllPizzaSliceData(userId);
			}

			if (sliceResponse?.error) {
				setErrorMessage(sliceResponse.error);
				return;
			}
			setFeed(sliceResponse);
		} catch (error) {
			setErrorMessage(error.message);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		getFeed();
	}, [filter]);

	return (
		<div className="mt-4 space-y-4">
			<h3 className="text-center">Welcome to the Pizza Sphere</h3>
			<div className="text-center mb-">
				<button
					className={`button-link mr-2 ${filter === 'all' ? 'opacity-50 cursor-not-allowed' : ''}`}
					onClick={() => setFilter('all')}
					disabled={filter === 'all'}
				>
					All
				</button>
				<button
					className={`button-link ${filter === 'user' ? 'opacity-50 cursor-not-allowed' : ''}`}
					onClick={() => setFilter('user')}
					disabled={filter === 'user'}
				>
					Self
				</button>
			</div>
			{loading ? (
				<FontAwesomeIcon
					icon="circle-notch"
					className="animate-spin mt-44 mx-auto"
					size="3x"
				/>
			) : errorMessage ? (
				<div className="text-center">{errorMessage}</div>
			) : (
				<div>
					{feed.length === 0 && (
						<div className="text-center mt-10">No pizza slices to show.</div>
					)}
					<div className="mt-10">
						{feed.map((slice) => (
							<Card
								sx={{
									padding: '8px',
									maxWidth: '500px',
									marginBottom: '8px',
									width: '100%',
									display: 'flex',
									flexWrap: 'wrap',
								}}
								key={slice.id}
							>
								<div className="flex items-center mb-3 w-full">
									<FontAwesomeIcon
										icon="user-circle"
										className="text-gray-500 mr-2"
										size="2x"
									/>
									<h6 className="m-0">{slice.user.username}</h6>
									<span className="mr-2 ml-2">•</span>
									<p className="m-0">
										{formatDistanceToNow(new Date(slice.createdAt))} ago
									</p>
								</div>
								<CardMedia
									component="img"
									sx={{
										height: '100%',
										width: '100%',
										objectFit: 'contain',
										maxHeight: '500px',
										objectPosition: 'center',
									}}
									image={slice.image}
									alt="Pizza image"
								/>
								<CardContent
									sx={{
										padding: '1rem 1rem .5rem',
										':last-child': { padding: '1rem 1rem .5rem' },
										width: '100%',
									}}
								>
									<div className="text-left">
										<div className="flex items-center justify-between">
											{renderPizzaSlices(slice.overall)}
											<LikeSection
												likes={slice.likes}
												pizzaSliceRatingId={slice.id}
											/>
										</div>
										<h5 className="mt-2 mb-0">{slice.pizzaPlace.mainText}</h5>
										{slice.notes && <p className="mt-2">{slice.notes}</p>}
									</div>
									<CommentSection
										comments={slice.comments}
										pizzaSliceRatingId={slice.id}
									/>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
