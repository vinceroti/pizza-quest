'use client';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import { useState } from 'react';

import { emailValidation, passwordValidation } from '@/utils/validation';
import { signup } from '~/actions';

export default function Signup() {
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');
	const [emailError, setEmailError] = useState('');

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setErrorMessage('');
		const data = new FormData(event.currentTarget);
		const email = data.get('email') as string;
		const password = data.get('password') as string;
		const confirmPassword = data.get('confirmPassword') as string;

		const { isValid: isEmailValid, emailErrorMsg } = emailValidation(email);
		const {
			isValid: isPasswordValid,
			passwordErrorMsg,
			confirmPasswordErrorMsg,
		} = passwordValidation(password, confirmPassword);

		if (!isPasswordValid || !isEmailValid) {
			setPasswordError(passwordErrorMsg);
			setConfirmPasswordError(confirmPasswordErrorMsg);
			setEmailError(emailErrorMsg);
			return;
		}

		setLoading(true);

		try {
			const user = await signup(email, password, confirmPassword);
			console.log('User created:', user);
		} catch (error) {
			setErrorMessage(error.message);
		} finally {
			setLoading(false);
		}
	};

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
						id="email"
						label="Email"
						name="email"
						autoComplete="email"
						autoFocus
						error={!!emailError}
						helperText={emailError}
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
						error={!!passwordError}
						helperText="Password must be at least 8 characters long."
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
						error={!!confirmPasswordError}
						helperText={confirmPasswordError}
					/>
					<LoadingButton
						loading={loading}
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Register
					</LoadingButton>
					{errorMessage && (
						<Alert
							severity="error"
							variant="filled"
							onClose={() => setErrorMessage('')}
						>
							{errorMessage}
						</Alert>
					)}
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
