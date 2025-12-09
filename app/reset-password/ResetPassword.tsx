'use client';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import { resetPassword, validateResetToken } from '@/app/actions';

export default function ResetPassword() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get('token');

	const [loading, setLoading] = useState(false);
	const [validating, setValidating] = useState(true);
	const [tokenValid, setTokenValid] = useState(false);
	const [email, setEmail] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');
	const [success, setSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

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

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		setPasswordError('');
		setConfirmPasswordError('');
		setErrorMessage('');

		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!password) {
			setPasswordError('Password is required');
			return;
		}

		if (password !== confirmPassword) {
			setConfirmPasswordError('Passwords do not match');
			return;
		}

		if (!token) {
			setErrorMessage('Invalid reset token');
			return;
		}

		setLoading(true);
		try {
			await resetPassword(token, password, confirmPassword);
			setSuccess(true);
			setTimeout(() => {
				router.push('/');
			}, 3000);
		} catch (error: unknown) {
			setErrorMessage((error as Error).message);
		} finally {
			setLoading(false);
		}
	};

	if (validating) {
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
					<p>Validating reset link...</p>
				</Box>
			</Container>
		);
	}

	if (!tokenValid) {
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
		<Container maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<h3 className="mb-4">Reset Password</h3>
				{success ? (
					<div className="text-center">
						<p className="text-green-500 mb-4">Password reset successful!</p>
						<p className="text-sm text-gray-400">Redirecting to login...</p>
					</div>
				) : (
					<Box
						component="form"
						noValidate
						sx={{ mt: 1 }}
						onSubmit={handleSubmit}
					>
						<p className="text-sm mb-4">
							Enter your new password for <strong>{email}</strong>
						</p>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="New Password"
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
							label="Confirm New Password"
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
					</Box>
				)}
			</Box>
		</Container>
	);
}
