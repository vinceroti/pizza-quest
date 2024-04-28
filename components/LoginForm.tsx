'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import React from 'react';
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
	event.preventDefault();
	const formData = new FormData(event.currentTarget);

	// Assuming your authentication setup expects 'username' as 'email'
	const response = await signIn('credentials', {
		redirect: false,
		email: formData.get('email'),
		password: formData.get('password'),
	});

	if (response?.error) {
		console.error(response.error);
	}
};

export default function LoginForm() {
	return (
		<Container maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<h3>Welcome!</h3>
				<p>Login to your journey for the greatest pizza slice.</p>
				<Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email"
						name="email"
						autoComplete="email"
						autoFocus
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Login
					</Button>
					<Typography variant="body2" align="center" sx={{ mt: 2 }}>
						Don't have an account?
						<Link href="/signup" className="ml-2">
							Sign Up
						</Link>
					</Typography>
				</Box>
			</Box>
		</Container>
	);
}
