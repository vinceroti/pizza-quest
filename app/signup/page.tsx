'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import * as React from 'react';

import { signup } from '~/actions';

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
	event.preventDefault();
	const data = new FormData(event.currentTarget);
	try {
		const user = await signup(
			data.get('email') as string,
			data.get('password') as string,
			data.get('username') as string,
		);
		console.log('User created:', user);
	} catch (error) {
		console.error(error);
	}
};

export default function Signup() {
	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<h3>Let's Get Started</h3>
				<p>Your quest for the greatest pizza slice begins now!</p>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						fullWidth
						id="username"
						label="Username"
						name="username"
						autoComplete="username"
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="new-password"
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="confirmPassword"
						label="Confirm Password"
						type="password"
						id="confirmPassword"
						autoComplete="new-password"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Register
					</Button>
					<p className="mt-2">
						Already have an account?
						<Link href="/" className="ml-2">
							Login
						</Link>
					</p>
				</Box>
			</Box>
		</Container>
	);
}
