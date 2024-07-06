'use client';

import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Like } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { useCallback, useState } from 'react';

import { addLikeToPizzaSliceRating } from '@/app/actions';

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

	const handleAddLike = async () => {
		if (session) {
			try {
				const updatedLikes = await addLikeToPizzaSliceRating({
					userId: session.user.id,
					username: session.user.username,
					pizzaSliceRatingId,
				});
				setLikeCount(updatedLikes.length);
			} catch (error) {
				console.error('Failed to add like:', error);
			}
		}
	};

	const debouncedHandleAddLike = useCallback(debounce(handleAddLike, 300), [
		session,
	]);

	const handleIconClick = () => {
		setLikeCount((prevCount) => prevCount + 1);
		debouncedHandleAddLike();
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
						className="text-gray-500 mr-2"
						size="xl"
					/>
				</button>
				<span>{likeCount}</span>
			</div>
		</div>
	);
};

export default LikeSection;
