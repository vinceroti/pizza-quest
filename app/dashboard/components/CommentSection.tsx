import { Button, List, ListItem, ListItemText, TextField } from '@mui/material';
import React, { useState } from 'react';

interface CommentSectionProps {
	comments: string[];
	username: string;
	pizzaSliceRatingId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({
	comments,
	username,
	pizzaSliceRatingId,
}) => {
	const [newComment, setNewComment] = useState<string>('');

	const handleAddComment = () => {
		if (newComment.trim() !== '') {
			// add new comment to API
			setNewComment('');
		}
	};

	return (
		<div>
			<hr className="mt-5 mb-5" />
			{comments.length > 0 ? (
				<List>
					{comments.map((comment, index) => (
						<ListItem key={index}>
							<ListItemText primary={comment} />
						</ListItem>
					))}
				</List>
			) : (
				<p>No comments yet</p>
			)}
			<TextField
				label="Add a comment"
				value={newComment}
				onChange={(e) => setNewComment(e.target.value)}
				fullWidth
				rows={1}
				variant="outlined"
				margin="normal"
			/>
			<Button
				variant="contained"
				color="primary"
				onClick={handleAddComment}
				fullWidth
			>
				Add Comment
			</Button>
		</div>
	);
};

export default CommentSection;
