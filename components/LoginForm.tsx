'use client';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';

import { emailValidation } from '@/utils/validation';
export default function LoginForm() {
	const [errorMessage, setErrorMessage] = useState(false);
	const [loading, setLoading] = useState(false);
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const router = useRouter();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		setEmailError('');
		setPasswordError('');

		const { isValid: isEmailValid, emailErrorMsg } = emailValidation(
			formData.get('email') as string,
		);
		const isPasswordValid = formData.get('password') !== '';

		if (!isEmailValid || !isPasswordValid) {
			setEmailError(emailErrorMsg);
			setPasswordError(!isPasswordValid ? 'Password is required' : '');
			return;
		}

		setErrorMessage(false);
		setLoading(true);
		try {
			await signIn('credentials', {
				redirect: false,
				email: formData.get('email'),
				password: formData.get('password'),
			});

			await router.push('/dashboard');
		} catch (error: unknown) {
			setLoading(false);
			setErrorMessage(true);
		}
	};
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
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
						error={!!passwordError}
						helperText={passwordError}
					/>
					<LoadingButton
						loading={loading}
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 2, mb: 2 }}
					>
						Login
					</LoadingButton>
					{errorMessage && (
						<Alert
							severity="error"
							variant="filled"
							onClose={() => setErrorMessage(false)}
						>
							Password or email is incorrect.
						</Alert>
					)}
					<Box sx={{ textAlign: 'center', mt: 2 }}>
						Don&apos;t have an account?
						<Link href="/signup" style={{ marginLeft: '0.5rem' }}>
							Sign Up
						</Link>
					</Box>
				</Box>
			</Box>
		</Container>
	);
}
