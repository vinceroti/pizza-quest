'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, List, ListItem, ListItemText, TextField } from '@mui/material';
import { Comment, User } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

import { addCommentToPizzaSliceRating } from '@/app/actions';
interface CommentSectionProps {
	comments: Comment[];
	user: User;
	pizzaSliceRatingId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({
	comments,
	pizzaSliceRatingId,
}) => {
	const { data: session } = useSession();

	const [newComment, setNewComment] = useState<string>('');
	const [commentList, setCommentList] = useState<Comment[]>(comments);
	const [loading, setLoading] = useState<boolean>(false);
	const [showAllComments, setShowAllComments] = useState<boolean>(false);

	const handleAddComment = async () => {
		if (newComment.trim() !== '' && session) {
			try {
				setLoading(true);
				const updatedComments = await addCommentToPizzaSliceRating({
					userId: session.user.id,
					username: session.user.username,
					pizzaSliceRatingId,
					text: newComment,
				});
				setCommentList(updatedComments);
				setNewComment('');
			} catch (error) {
				console.error('Failed to add comment:', error);
			} finally {
				setLoading(false);
			}
		}
	};

	const handleShowAllComments = () => {
		setShowAllComments(true);
	};

	return (
		<div>
			<hr className="mt-5 mb-5" />
			{commentList?.length > 0 ? (
				<List sx={{ padding: '0' }}>
					{commentList
						.slice(0, showAllComments ? commentList.length : 1)
						.map((comment, index) => (
							<ListItem key={index} alignItems="flex-start">
								<FontAwesomeIcon
									icon="user-circle"
									className="text-gray-500 mr-2 mt-2"
									size="2x"
								/>
								<ListItemText
									primary={comment.text}
									secondary={
										<>
											<span>{comment.username}</span>
											<br />
											<span>
												{formatDistanceToNow(new Date(comment.createdAt))} ago
											</span>
										</>
									}
								/>
							</ListItem>
						))}
				</List>
			) : (
				<p>No comments yet</p>
			)}
			{commentList.length > 1 && !showAllComments && (
				<Button onClick={handleShowAllComments} variant="text" color="primary">
					Load More Comments...
				</Button>
			)}
			<TextField
				label="Add a comment"
				value={newComment}
				onChange={(e) => setNewComment(e.target.value)}
				fullWidth
				rows={1}
				disabled={loading}
				variant="outlined"
				margin="normal"
			/>
			<LoadingButton
				loading={loading}
				disabled={!newComment.length}
				variant="contained"
				color="primary"
				onClick={handleAddComment}
				fullWidth
			>
				Add Comment
			</LoadingButton>
		</div>
	);
};

export default CommentSection;
