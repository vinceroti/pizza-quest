'use client';

import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Like } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
	addLikeToPizzaSliceRating,
	removeLikeFromPizzaSliceRating,
} from '@/app/actions';

interface LikeSectionProps {
	likes: Like[];
	pizzaSliceRatingId: number;
}

const LikeSection: React.FC<LikeSectionProps> = ({
	likes,
	pizzaSliceRatingId,
}) => {
	const { data: session } = useSession();

	const [likeCount, setLikeCount] = useState<number>(likes?.length || 0);
	const [hasLiked, setHasLiked] = useState<boolean>(false);
	const debounceTimer = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (session) {
			const userHasLiked = likes.some(
				(like) => like.userId === session.user.id,
			);
			setHasLiked(userHasLiked);
		}
	}, [session, likes]);

	const performLikeAction = useCallback(
		async (shouldLike: boolean) => {
			if (!session) return;
			try {
				if (shouldLike) {
					const updatedLikes = await addLikeToPizzaSliceRating({
						pizzaSliceRatingId,
					});
					setLikeCount(updatedLikes.length);
					setHasLiked(true);
				} else {
					const updatedLikes = await removeLikeFromPizzaSliceRating({
						pizzaSliceRatingId,
					});
					setLikeCount(updatedLikes.length);
					setHasLiked(false);
				}
			} catch (error) {
				setHasLiked(!shouldLike);
				setLikeCount((prev) => (shouldLike ? prev - 1 : prev + 1));
				console.error('Failed to update like:', error);
			}
		},
		[session, pizzaSliceRatingId],
	);

	const handleIconClick = () => {
		const newHasLiked = !hasLiked;
		setHasLiked(newHasLiked);
		setLikeCount((prev) => (newHasLiked ? prev + 1 : prev - 1));

		if (debounceTimer.current) {
			clearTimeout(debounceTimer.current);
		}
		debounceTimer.current = setTimeout(() => {
			performLikeAction(newHasLiked);
		}, 300);
	};

	useEffect(() => {
		return () => {
			if (debounceTimer.current) {
				clearTimeout(debounceTimer.current);
			}
		};
	}, []);

	return (
		<div>
			<div className="flex items-center">
				<button
					onClick={handleIconClick}
					className="bg-none border-none cursor-pointer flex items-center"
					aria-label={hasLiked ? 'Unlike this rating' : 'Like this rating'}
				>
					<FontAwesomeIcon
						icon={faThumbsUp}
						className={`mr-2 ${
							hasLiked
								? 'text-blue-500'
								: 'text-gray-500 hover:text-blue-500'
						} transition-colors duration-200`}
						size="xl"
					/>
				</button>
				<span>{likeCount}</span>
			</div>
		</div>
	);
};

export default LikeSection;
