'use client';

import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import { FormEvent, useState } from 'react';

import { requestPasswordReset } from '@/app/actions';
import { emailValidation } from '@/utils/validation';

export default function ForgotPassword() {
	const [loading, setLoading] = useState(false);
	const [emailError, setEmailError] = useState('');
	const [success, setSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		setEmailError('');
		setErrorMessage('');

		const email = formData.get('email') as string;
		const { isValid: isEmailValid, emailErrorMsg } = emailValidation(email);

		if (!isEmailValid) {
			setEmailError(emailErrorMsg);
			return;
		}

		setLoading(true);
		try {
			await requestPasswordReset(email);
			setSuccess(true);
		} catch (error: unknown) {
			setErrorMessage((error as Error).message);
		} finally {
			setLoading(false);
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
				<h3 className="mb-4">Forgot Password</h3>
				{success ? (
					<div className="text-center">
						<p className="mb-4">
							If an account exists with that email, we&apos;ve sent password
							reset instructions.
						</p>
						<p className="text-sm text-gray-400 mb-4">
							Check your email for a link to reset your password.
						</p>
						<Link href="/">Back to Login</Link>
					</div>
				) : (
					<Box
						component="form"
						noValidate
						sx={{ mt: 1 }}
						onSubmit={handleSubmit}
					>
						<p className="text-sm mb-4">
							Enter your email address and we&apos;ll send you a link to reset
							your password.
						</p>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							error={!!emailError}
							helperText={emailError}
						/>
						<LoadingButton
							loading={loading}
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Send Reset Link
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
						<p className="text-sm text-center mt-2">
							<Link href="/">Back to Login</Link>
						</p>
					</Box>
				)}
			</Box>
		</Container>
	);
}
