'use client';

import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Like } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';

import {
	addLikeToPizzaSliceRating,
	removeLikeFromPizzaSliceRating,
} from '@/app/actions';

interface LikeSectionProps {
	likes: Like[];
	pizzaSliceRatingId: number;
}

const debounce = (func: (...args: unknown[]) => void, wait: number) => {
	let timeout: NodeJS.Timeout;
	return function executedFunction(...args: unknown[]) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

const LikeSection: React.FC<LikeSectionProps> = ({
	likes,
	pizzaSliceRatingId,
}) => {
	const { data: session } = useSession();

	const [likeCount, setLikeCount] = useState<number>(likes?.length || 0);
	const [hasLiked, setHasLiked] = useState<boolean>(false);

	useEffect(() => {
		if (session) {
			const userHasLiked = likes.some(
				(like) => like.userId === session.user.id,
			);
			setHasLiked(userHasLiked);
		}
	}, [session, likes]);

	const handleAddLike = async () => {
		if (session && !hasLiked) {
			try {
				const updatedLikes = await addLikeToPizzaSliceRating({
					userId: session.user.id,
					username: session.user.username,
					pizzaSliceRatingId,
				});
				setLikeCount(updatedLikes.length);
				setHasLiked(true);
			} catch (error) {
				setLikeCount((prevCount) => prevCount - 1);
				setHasLiked(false);
				console.error('Failed to add like:', error);
			}
		}
	};

	const handleRemoveLike = async () => {
		if (session && hasLiked) {
			try {
				const updatedLikes = await removeLikeFromPizzaSliceRating({
					userId: session.user.id,
					pizzaSliceRatingId,
				});
				setLikeCount(updatedLikes.length);
				setHasLiked(false);
			} catch (error) {
				setLikeCount((prevCount) => prevCount + 1);
				setHasLiked(true);
				console.error('Failed to remove like:', error);
			}
		}
	};

	const debouncedHandleAddLike = useCallback(debounce(handleAddLike, 300), [
		session,
		hasLiked,
	]);

	const debouncedHandleRemoveLike = useCallback(
		debounce(handleRemoveLike, 300),
		[session, hasLiked],
	);

	const handleIconClick = () => {
		if (hasLiked) {
			setLikeCount((prevCount) => prevCount - 1);
			setHasLiked(false);
			debouncedHandleRemoveLike();
		} else {
			setLikeCount((prevCount) => prevCount + 1);
			setHasLiked(true);
			debouncedHandleAddLike();
		}
	};

	return (
		<div>
			<div className="flex items-center">
				<button
					onClick={handleIconClick}
					className="bg-none border-none cursor-pointer flex items-center"
				>
					<FontAwesomeIcon
						icon={faThumbsUp}
						// eslint-disable-next-line max-len
						className={`mr-2 ${hasLiked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'} transition-colors duration-200`}
						size="xl"
					/>
				</button>
				<span>{likeCount}</span>
			</div>
		</div>
	);
};

export default LikeSection;
