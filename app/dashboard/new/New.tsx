'use client';

import {
	Button,
	FormControl,
	FormGroup,
	FormLabel,
	Rating,
} from '@mui/material';
import { useState } from 'react';

export default function Dashboard() {
	const [rating, setRating] = useState<number | null>(2.5);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log(file, rating);
	};

	return (
		<div>
			<h4>Upload and Rate Pizza Slices</h4>
			<FormControl
				component="form"
				onSubmit={handleSubmit}
				sx={{ width: '100%' }}
			>
				<FormGroup>
					<FormLabel component="legend">Rate your Pizza Slice</FormLabel>
					<Rating
						name="pizza-rating"
						value={rating}
						precision={0.5}
						onChange={(event, newValue) => {
							setRating(newValue);
						}}
					/>
				</FormGroup>
				<Button type="submit" variant="contained" color="primary">
					Submit
				</Button>
			</FormControl>
		</div>
	);
}
