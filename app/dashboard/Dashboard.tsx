'use client';

import {
	Box,
	Button,
	FormControl,
	FormGroup,
	FormHelperText,
	FormLabel,
	Input,
	InputLabel,
	Rating,
} from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Dashboard() {
	const [file, setFile] = useState<File | null>(null);
	const [rating, setRating] = useState<number | null>(2.5);
	const { data: session } = useSession();

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files[0]) {
			setFile(files[0]);
		}
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log(file, rating);
	};

	return (
		<Box sx={{ '& > :not(style)': { m: 1 } }}>
			<h4>Upload and Rate Pizza Slices</h4>
			<h6>Welcome, {session?.user?.username}</h6>
			<FormControl
				component="form"
				onSubmit={handleSubmit}
				sx={{ width: '100%' }}
			>
				<FormGroup>
					<InputLabel htmlFor="contained-button-file">Upload File</InputLabel>
					<Input
						id="contained-button-file"
						type="file"
						onChange={handleFileChange}
						sx={{ display: 'none' }}
						inputProps={{ 'aria-label': 'Upload file' }}
					/>
					<label htmlFor="contained-button-file">
						<Button variant="contained" component="span">
							Upload
						</Button>
					</label>
					{file && <FormHelperText>{file.name}</FormHelperText>}
				</FormGroup>
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
				<Button
					onClick={() => signOut()}
					variant="contained"
					color="secondary"
					sx={{ mt: 2 }}
				>
					Sign Out
				</Button>
			</FormControl>
		</Box>
	);
}
