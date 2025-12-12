'use client';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { resetPassword, validateResetToken } from '@/app/actions';
import { passwordValidation } from '@/utils/validation';

export default function ResetPassword() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get('token');

	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');
	const [validating, setValidating] = useState(true);
	const [tokenValid, setTokenValid] = useState(false);
	const [email, setEmail] = useState('');

	useEffect(() => {
		async function checkToken() {
			if (!token) {
				setTokenValid(false);
				setValidating(false);
				return;
			}

			const result = await validateResetToken(token);
			setTokenValid(result.valid);
			if (result.valid && result.email) {
				setEmail(result.email);
			} else {
				setErrorMessage(result.message || 'Invalid token');
			}
			setValidating(false);
		}

		checkToken();
	}, [token]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setErrorMessage('');
		setPasswordError('');
		setConfirmPasswordError('');

		const data = new FormData(event.currentTarget);
		const password = data.get('password') as string;
		const confirmPassword = data.get('confirmPassword') as string;

		const {
			isValid: isPasswordValid,
			passwordErrorMsg,
			confirmPasswordErrorMsg,
		} = passwordValidation(password, confirmPassword);

		if (!isPasswordValid) {
			setPasswordError(passwordErrorMsg);
			setConfirmPasswordError(confirmPasswordErrorMsg);
			return;
		}

		if (!token) {
			setErrorMessage('Invalid reset token');
			return;
		}

		setLoading(true);

		try {
			await resetPassword(token, password, confirmPassword);
			await signIn('credentials', {
				email,
				password,
				redirect: false,
			});
			router.push('/dashboard');
		} catch (error: unknown) {
			setErrorMessage((error as Error).message);
			setLoading(false);
		}
	};

	if (validating) {
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
					<p>Validating reset link...</p>
				</Box>
			</Container>
		);
	}

	if (!tokenValid) {
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
					<h3 className="mb-4">Invalid or Expired Link</h3>
					<p className="mb-4">
						{errorMessage ||
							'This password reset link is invalid or has expired.'}
					</p>
					<Link href="/forgot-password">Request a new reset link</Link>
				</Box>
			</Container>
		);
	}

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
				<h3>Reset Password</h3>
				<p>Enter your new password for {email}</p>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="new-password"
						autoFocus
						error={!!passwordError}
						helperText={passwordError}
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
						Reset Password
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
					<Box sx={{ mt: 2 }}>
						Remember your password?
						<Link href="/" style={{ marginLeft: '0.5rem' }}>
							Login
						</Link>
					</Box>
				</Box>
			</Box>
		</Container>
	);
}
